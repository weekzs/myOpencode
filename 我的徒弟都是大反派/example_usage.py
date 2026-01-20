#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
使用示例：如何自定义使用爬虫脚本
"""

from comic_crawler import ComicCrawler

# 示例1: 爬取所有章节（使用5个线程并行下载）
def example1():
    """爬取所有章节"""
    crawler = ComicCrawler(
        base_url="https://www.twmanga.com",
        comic_id="wodetudidushidafanpai-yuetian",
        output_dir="images",
        max_workers=5  # 并行线程数，可根据网络情况调整（建议3-10）
    )
    crawler.crawl_all()

# 示例2: 只爬取前10章（用于测试）
def example2():
    """只爬取前10章"""
    crawler = ComicCrawler(
        base_url="https://www.twmanga.com",
        comic_id="wodetudidushidafanpai-yuetian",
        output_dir="images",
        max_workers=5  # 并行线程数
    )
    crawler.crawl_all(start_chapter=0, end_chapter=10)

# 示例3: 从第5章开始爬取
def example3():
    """从第5章开始爬取"""
    crawler = ComicCrawler(
        base_url="https://www.twmanga.com",
        comic_id="wodetudidushidafanpai-yuetian",
        output_dir="images",
        max_workers=5  # 并行线程数
    )
    crawler.crawl_all(start_chapter=5)

# 示例4: 使用更多线程提高速度（注意：过多线程可能导致被限流）
def example4():
    """使用10个线程并行下载（速度更快，但可能被限流）"""
    crawler = ComicCrawler(
        base_url="https://www.twmanga.com",
        comic_id="wodetudidushidafanpai-yuetian",
        output_dir="images",
        max_workers=10  # 更多线程，速度更快
    )
    crawler.crawl_all()

if __name__ == "__main__":
    # 首次运行建议先测试：只爬取前10章
    example2()  # 测试模式：只爬取前10章
    
    # 测试成功后，可以取消注释下面的代码来爬取所有章节
    # example1()  # 爬取所有章节
    # example3()  # 续传模式：从第5章开始
