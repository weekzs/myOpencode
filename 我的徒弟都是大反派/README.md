# 漫画爬虫脚本

用于爬取"我的徒弟都是大反派"漫画的所有章节和图片。

## 功能特点

- ✅ 自动获取所有章节列表
- ✅ 按章节顺序下载图片
- ✅ 每章图片自动排序
- ✅ 支持断点续传（已下载的图片会跳过）
- ✅ 自动保存章节信息到JSON文件
- ✅ 友好的进度显示

## 安装依赖

```bash
pip install -r requirements.txt
```

## 使用方法

### 基本使用

直接运行脚本，会爬取所有章节：

```bash
python comic_crawler.py
```

### 自定义参数

编辑 `comic_crawler.py` 文件中的 `main()` 函数：

```python
def main():
    # 配置参数
    COMIC_ID = "wodetudidushidafanpai-yuetian"
    BASE_URL = "https://www.twmanga.com"
    OUTPUT_DIR = "我的徒弟都是大反派"
    
    # 创建爬虫实例
    crawler = ComicCrawler(BASE_URL, COMIC_ID, OUTPUT_DIR)
    
    # 爬取所有章节
    crawler.crawl_all()
    
    # 或者只爬取指定范围的章节（例如前10章用于测试）
    # crawler.crawl_all(start_chapter=0, end_chapter=10)
```

### 爬取指定章节范围

```python
# 只爬取第0章到第10章
crawler.crawl_all(start_chapter=0, end_chapter=10)

# 从第5章开始爬取到最后一章
crawler.crawl_all(start_chapter=5)
```

## 输出结构

下载的文件会按以下结构组织：

```
我的徒弟都是大反派/
├── chapters_info.json          # 章节信息JSON文件
├── 0000_序章/                   # 章节目录
│   ├── 0001.jpg
│   ├── 0002.jpg
│   └── ...
├── 0001_第一回/
│   ├── 0001.jpg
│   ├── 0002.jpg
│   └── ...
└── ...
```

## 注意事项

1. **请遵守网站使用条款**：本脚本仅供学习交流使用，请勿用于商业用途
2. **请求频率**：脚本已内置延迟机制，避免请求过快
3. **网络问题**：如果下载失败，可以重新运行脚本，已下载的文件会被跳过
4. **存储空间**：请确保有足够的磁盘空间存储所有图片

## 故障排除

### 问题：无法获取章节列表

**解决方案**：脚本会自动尝试通过递增章节slot的方式获取章节。如果仍然失败，请检查网络连接。

### 问题：某些章节的图片下载失败

**解决方案**：
1. 检查网络连接
2. 重新运行脚本，已下载的图片会被跳过
3. 检查目标网站是否可访问

### 问题：图片顺序不正确

**解决方案**：脚本会根据图片URL中的数字进行排序。如果顺序仍有问题，可以手动调整文件名。

## 技术说明

- 使用 `requests` 库进行HTTP请求
- 使用 `BeautifulSoup` 解析HTML
- 支持懒加载图片的提取
- 自动处理文件名中的非法字符

## 许可证

本脚本仅供学习交流使用。
