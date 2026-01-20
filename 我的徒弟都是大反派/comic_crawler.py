#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
漫画爬虫脚本
用于爬取"我的徒弟都是大反派"的所有章节和图片
"""

import os
import re
import time
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import json
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading


class ComicCrawler:
    def __init__(self, base_url, comic_id, output_dir="images", max_workers=5):
        """
        初始化爬虫
        
        Args:
            base_url: 漫画网站基础URL
            comic_id: 漫画ID
            output_dir: 输出目录
            max_workers: 最大并发线程数（默认5，可根据网络情况调整）
        """
        self.base_url = base_url
        self.comic_id = comic_id
        self.output_dir = output_dir
        self.max_workers = max_workers
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': 'https://www.twmanga.com/',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        })
        
        # 创建输出目录
        Path(self.output_dir).mkdir(parents=True, exist_ok=True)
        
        # 线程锁，用于保护共享资源
        self.print_lock = threading.Lock()
        self.info_lock = threading.Lock()
        
        # 备用网站列表（按优先级排序）
        self.backup_sites = [
            {
                'base': 'https://www.twmanga.com',
                'chapter_url_template': 'https://www.twmanga.com/comic/chapter/{comic_id}/0_{slot}.html',
                'referer': 'https://www.twmanga.com/'
            },
            {
                'base': 'https://cn.cnbzmg.com',
                'chapter_url_template': 'https://cn.cnbzmg.com/comic/chapter/{comic_id}/0_{slot}.html',
                'referer': 'https://cn.cnbzmg.com/'
            }
        ]
        
    def get_chapter_list(self):
        """
        获取所有章节列表
        
        Returns:
            list: 章节列表，每个元素包含章节名称和章节slot
        """
        print("正在获取章节列表...")
        catalog_url = f"https://www.baozimh.com/comic/{self.comic_id}"
        
        try:
            response = self.session.get(catalog_url, timeout=30)
            response.raise_for_status()
            response.encoding = 'utf-8'
            
            soup = BeautifulSoup(response.text, 'html.parser')
            chapters = []
            
            # 查找所有章节链接
            # 章节链接格式：/user/page_direct?comic_id=xxx&section_slot=0&chapter_slot=X
            chapter_links = soup.find_all('a', href=re.compile(r'chapter_slot=\d+'))
            
            for link in chapter_links:
                href = link.get('href', '')
                chapter_name = link.get_text(strip=True)
                
                # 从URL中提取chapter_slot
                match = re.search(r'chapter_slot=(\d+)', href)
                if match:
                    chapter_slot = int(match.group(1))
                    chapters.append({
                        'name': chapter_name,
                        'slot': chapter_slot,
                        'url': href
                    })
            
            # 去重并按slot排序
            seen = set()
            unique_chapters = []
            for chapter in chapters:
                if chapter['slot'] not in seen:
                    seen.add(chapter['slot'])
                    unique_chapters.append(chapter)
            
            unique_chapters.sort(key=lambda x: x['slot'])
            
            print(f"找到 {len(unique_chapters)} 个章节")
            return unique_chapters
            
        except Exception as e:
            print(f"获取章节列表失败: {e}")
            # 如果获取失败，尝试从0开始递增获取
            print("尝试从章节0开始递增获取...")
            return self._get_chapters_by_increment()
    
    def _get_chapters_by_increment(self):
        """
        通过递增章节slot的方式获取章节列表
        """
        chapters = []
        max_chapters = 500  # 假设最多500章
        failed_count = 0
        
        for slot in range(max_chapters):
            chapter_url = f"https://www.twmanga.com/comic/chapter/{self.comic_id}/0_{slot}.html"
            try:
                response = self.session.get(chapter_url, timeout=10)
                if response.status_code == 200:
                    soup = BeautifulSoup(response.text, 'html.parser')
                    title_tag = soup.find('title')
                    if title_tag:
                        title = title_tag.get_text(strip=True)
                        # 提取章节名称
                        chapter_name = title.split('-')[0].strip() if '-' in title else f"第{slot}章"
                        chapters.append({
                            'name': chapter_name,
                            'slot': slot,
                            'url': chapter_url
                        })
                        failed_count = 0
                        print(f"找到章节 {slot}: {chapter_name}")
                    else:
                        failed_count += 1
                else:
                    failed_count += 1
                    
                if failed_count >= 5:  # 连续5次失败，认为已到最后一章
                    break
                    
                time.sleep(0.5)  # 避免请求过快
                
            except Exception as e:
                failed_count += 1
                if failed_count >= 5:
                    break
                    
        return chapters
    
    def _create_session(self, referer=None):
        """为每个线程创建独立的session"""
        if referer is None:
            referer = 'https://www.twmanga.com/'
            
        session = requests.Session()
        session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': referer,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        })
        return session
    
    def _extract_images_from_html(self, html_text, soup, session, seen_urls):
        """
        从HTML中提取图片URL（通用方法）
        
        Args:
            html_text: HTML文本
            soup: BeautifulSoup对象
            session: requests.Session对象
            seen_urls: 已见过的URL集合
            
        Returns:
            list: 图片URL列表
        """
        images = []
        
            
        # 方法1: 从img标签获取
        img_tags = soup.find_all('img')
        for img in img_tags:
            # 尝试多个可能的属性
            src = (img.get('src') or 
                  img.get('data-src') or 
                  img.get('data-lazy-src') or 
                  img.get('data-original') or
                  img.get('data-url') or
                  '')
            alt = img.get('alt', '')
            
            # 过滤漫画内容图片
            if src and (src.startswith('http') or src.startswith('//')):
                if src.startswith('//'):
                    src = 'https:' + src
                # 检查是否是漫画图片（通过URL特征或alt属性）
                is_comic_image = (
                    'scomic' in src or 
                    'bzcdn' in src or
                    'cnbzmg' in src or
                    'twmanga' in src or
                    (alt and ('我的徒弟' in alt or self.comic_id.replace('-', '') in alt.replace('-', '')))
                )
                
                if is_comic_image and src not in seen_urls:
                    images.append({
                        'url': src,
                        'alt': alt
                    })
                    seen_urls.add(src)
        
        # 方法2: 从页面HTML源码中提取（处理懒加载情况）
        # 查找所有可能的图片URL模式
        patterns = [
            r'https?://[^"\s\']+scomic[^"\s\']+\.(jpg|png|jpeg|webp)',
            r'https?://[^"\s\']+bzcdn[^"\s\']+\.(jpg|png|jpeg|webp)',
            r'https?://[^"\s\']+static[^"\s\']+comic[^"\s\']+\.(jpg|png|jpeg|webp)',
            r'https?://[^"\s\']+cnbzmg[^"\s\']+\.(jpg|png|jpeg|webp)',
            r'["\'](https?://[^"\']+\.(jpg|png|jpeg|webp))["\']',
        ]
        
        for pattern in patterns:
            matches = re.finditer(pattern, html_text, re.IGNORECASE)
            for match in matches:
                url = match.group(1) if len(match.groups()) > 1 else match.group(0)
                if url and url not in seen_urls:
                    # 过滤掉非漫画图片
                    if any(keyword in url.lower() for keyword in ['scomic', 'bzcdn', 'comic', 'cnbzmg']) or \
                       self.comic_id.replace('-', '') in url.replace('-', ''):
                        images.append({
                            'url': url,
                            'alt': ''
                        })
                        seen_urls.add(url)
        
        # 方法3: 尝试从script标签中提取JSON数据或变量
        scripts = soup.find_all('script')
        for script in scripts:
            if script.string:
                # 查找包含图片URL的JSON数据或JavaScript变量
                json_patterns = [
                    r'["\'](https?://[^"\']+scomic[^"\']+\.(jpg|png|jpeg|webp))["\']',
                    r'["\'](https?://[^"\']+bzcdn[^"\']+\.(jpg|png|jpeg|webp))["\']',
                    r'imageUrls?\s*[:=]\s*\[(.*?)\]',
                    r'images?\s*[:=]\s*\[(.*?)\]',
                ]
                
                for pattern in json_patterns:
                    matches = re.finditer(pattern, script.string, re.IGNORECASE | re.DOTALL)
                    for match in matches:
                        if len(match.groups()) > 0:
                            content = match.group(1)
                            # 提取其中的URL
                            url_matches = re.finditer(r'https?://[^\s\[\],"]+\.(jpg|png|jpeg|webp)', content, re.IGNORECASE)
                            for url_match in url_matches:
                                url = url_match.group(0)
                                if url not in seen_urls:
                                    images.append({'url': url, 'alt': ''})
                                    seen_urls.add(url)
                        else:
                            url = match.group(0).strip('"\'')
                            if url not in seen_urls and 'http' in url:
                                images.append({'url': url, 'alt': ''})
                                seen_urls.add(url)
        
        return images
    
    def get_chapter_images(self, chapter_slot, session=None):
        """
        获取指定章节的所有图片URL（支持多网站重试）
        
        Args:
            chapter_slot: 章节slot编号
            session: requests.Session对象，如果为None则使用self.session
            
        Returns:
            list: 图片URL列表
        """
        if session is None:
            session = self.session
        
        # 尝试从所有备用网站获取图片
        for site_info in self.backup_sites:
            chapter_url = site_info['chapter_url_template'].format(
                comic_id=self.comic_id,
                slot=chapter_slot
            )
            
            try:
                # 创建带正确referer的session
                site_session = self._create_session(site_info['referer'])
                response = site_session.get(chapter_url, timeout=30)
                response.raise_for_status()
                response.encoding = 'utf-8'
                
                soup = BeautifulSoup(response.text, 'html.parser')
                seen_urls = set()
                
                # 提取图片
                images = self._extract_images_from_html(response.text, soup, site_session, seen_urls)
                
                # 方法4: 如果仍然没有找到图片，尝试从已知的图片URL模式构建
                if not images:
                    # 尝试从页面中提取章节路径信息
                    path_pattern = r'/(\d+)-([a-z0-9]+)/'
                    path_matches = re.findall(path_pattern, response.text)
                    
                    if path_matches:
                        section, path_id = path_matches[0]
                        # 尝试多个可能的CDN域名
                        cdn_domains = [
                            f"https://s1-ogsm1-uspho.bzcdn.net/scomic/{self.comic_id}/{section}/{section}-{path_id}",
                            f"https://www.bzcdn.net/scomic/{self.comic_id}/{section}/{section}-{path_id}",
                        ]
                        
                        for base_url in cdn_domains:
                            found_count = 0
                            for img_num in range(1, 51):  # 最多尝试50张
                                test_url = f"{base_url}/{img_num}.jpg"
                                try:
                                    test_response = site_session.head(test_url, timeout=5)
                                    if test_response.status_code == 200:
                                        if test_url not in seen_urls:
                                            images.append({'url': test_url, 'alt': f'图片{img_num}'})
                                            seen_urls.add(test_url)
                                            found_count += 1
                                    else:
                                        # 如果连续5次失败，停止尝试
                                        if found_count == 0 and img_num > 5:
                                            break
                                except:
                                    if found_count == 0 and img_num > 5:
                                        break
                            if images:
                                break
                
                # 如果找到了图片，返回结果
                if images:
                    # 按URL中的数字排序（图片文件名通常包含序号）
                    def extract_number(url):
                        match = re.search(r'/(\d+)\.(jpg|png|jpeg|webp)', url, re.IGNORECASE)
                        if match:
                            return int(match.group(1))
                        filename = os.path.basename(urlparse(url).path)
                        match = re.search(r'(\d+)', filename)
                        return int(match.group(1)) if match else 9999
                    
                    images.sort(key=lambda x: extract_number(x['url']))
                    return images
                    
            except Exception as e:
                # 如果这个网站失败，继续尝试下一个
                continue
        
        # 所有网站都失败
        return []
    
    def download_image(self, url, save_path, session=None):
        """
        下载单张图片
        
        Args:
            url: 图片URL
            save_path: 保存路径
            session: requests.Session对象，如果为None则使用self.session
            
        Returns:
            bool: 是否下载成功
        """
        if session is None:
            session = self.session
            
        try:
            response = session.get(url, timeout=30, stream=True)
            response.raise_for_status()
            
            # 确保目录存在
            os.makedirs(os.path.dirname(save_path), exist_ok=True)
            
            with open(save_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            
            return True
            
        except Exception as e:
            print(f"下载图片失败 {url}: {e}")
            return False
    
    def sanitize_filename(self, filename):
        """
        清理文件名，移除非法字符
        
        Args:
            filename: 原始文件名
            
        Returns:
            str: 清理后的文件名
        """
        # 移除或替换非法字符
        illegal_chars = r'[<>:"/\\|?*]'
        filename = re.sub(illegal_chars, '_', filename)
        return filename.strip()
    
    def _crawl_chapter(self, chapter, idx, total_chapters):
        """
        处理单个章节的下载（保持章节内图片顺序）
        
        Args:
            chapter: 章节信息字典
            idx: 章节索引
            total_chapters: 总章节数
            
        Returns:
            dict: 章节信息
        """
        # 为每个线程创建独立的session
        session = self._create_session()
        
        chapter_slot = chapter['slot']
        chapter_name = chapter['name']
        
        with self.print_lock:
            print(f"\n[{idx}/{total_chapters}] 正在处理: {chapter_name} (slot: {chapter_slot})")
        
        # 获取章节图片
        images = self.get_chapter_images(chapter_slot, session)
        
        if not images:
            with self.print_lock:
                print(f"  警告: 章节 {chapter_name} 未找到图片，跳过")
            return None
        
        with self.print_lock:
            print(f"  找到 {len(images)} 张图片")
        
        # 创建章节目录
        safe_chapter_name = self.sanitize_filename(f"{chapter_slot:04d}_{chapter_name}")
        chapter_dir = os.path.join(self.output_dir, safe_chapter_name)
        os.makedirs(chapter_dir, exist_ok=True)
        
        # 下载图片（保持顺序）
        downloaded_count = 0
        for img_idx, img_info in enumerate(images, 1):
            img_url = img_info['url']
            
            # 确定文件扩展名
            ext = os.path.splitext(urlparse(img_url).path)[1] or '.jpg'
            img_filename = f"{img_idx:04d}{ext}"
            img_path = os.path.join(chapter_dir, img_filename)
            
            # 如果文件已存在，跳过
            if os.path.exists(img_path):
                downloaded_count += 1
                continue
            
            with self.print_lock:
                print(f"  [{chapter_name}] 下载图片 {img_idx}/{len(images)}: {img_filename}")
            
            if self.download_image(img_url, img_path, session):
                downloaded_count += 1
            else:
                with self.print_lock:
                    print(f"  [{chapter_name}] 下载失败: {img_filename}")
            
            # 避免请求过快（章节内图片下载间隔）
            time.sleep(0.2)
        
        # 记录章节信息
        chapter_info = {
            'slot': chapter_slot,
            'name': chapter_name,
            'dir': safe_chapter_name,
            'image_count': downloaded_count,
            'total_images': len(images)
        }
        
        with self.print_lock:
            print(f"  [{chapter_name}] 完成: {downloaded_count}/{len(images)} 张图片")
        
        return chapter_info
    
    def crawl_all(self, start_chapter=0, end_chapter=None):
        """
        爬取所有章节
        
        Args:
            start_chapter: 起始章节slot（默认0）
            end_chapter: 结束章节slot（None表示到最后一章）
        """
        print("=" * 60)
        print("开始爬取漫画")
        print("=" * 60)
        
        # 获取章节列表
        chapters = self.get_chapter_list()
        
        if not chapters:
            print("未找到任何章节，退出")
            return
        
        # 过滤章节范围
        if start_chapter > 0:
            chapters = [ch for ch in chapters if ch['slot'] >= start_chapter]
        if end_chapter is not None:
            chapters = [ch for ch in chapters if ch['slot'] <= end_chapter]
        
        total_chapters = len(chapters)
        print(f"准备爬取 {total_chapters} 个章节（使用 {self.max_workers} 个线程并行下载）")
        print("=" * 60)
        
        # 保存章节信息
        chapter_info = []
        
        # 使用线程池并行处理章节
        with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            # 提交所有任务
            future_to_chapter = {
                executor.submit(self._crawl_chapter, chapter, idx, total_chapters): (idx, chapter)
                for idx, chapter in enumerate(chapters, 1)
            }
            
            # 收集结果（按章节顺序）
            results = {}
            for future in as_completed(future_to_chapter):
                idx, chapter = future_to_chapter[future]
                try:
                    result = future.result()
                    if result:
                        results[idx] = result
                except Exception as e:
                    with self.print_lock:
                        print(f"章节 {chapter['name']} 处理失败: {e}")
            
            # 按索引顺序整理章节信息
            chapter_info = [results[i] for i in sorted(results.keys())]
        
        # 保存章节信息到JSON文件
        info_file = os.path.join(self.output_dir, 'chapters_info.json')
        with open(info_file, 'w', encoding='utf-8') as f:
            json.dump(chapter_info, f, ensure_ascii=False, indent=2)
        
        print("\n" + "=" * 60)
        print("爬取完成！")
        print(f"共处理 {len(chapter_info)} 个章节")
        print(f"章节信息已保存到: {info_file}")
        print("=" * 60)


def main():
    """主函数"""
    # 配置参数
    COMIC_ID = "wodetudidushidafanpai-yuetian"
    BASE_URL = "https://www.twmanga.com"
    OUTPUT_DIR = "images"
    
    # 创建爬虫实例
    crawler = ComicCrawler(BASE_URL, COMIC_ID, OUTPUT_DIR)
    
    # 开始爬取（可以指定起始和结束章节）
    # crawler.crawl_all(start_chapter=0, end_chapter=10)  # 只爬取前10章用于测试
    crawler.crawl_all()  # 爬取所有章节


if __name__ == "__main__":
    main()
