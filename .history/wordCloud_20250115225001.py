import mysql.connector
import pandas as pd
import jieba
from collections import Counter
import json
from mysql.connector import Error

try:
    # 建立数据库连接
    connection = mysql.connector.connect(
        host='localhost',       # 数据库主机地址
        port="13306",
        database='science_fiction',  # 数据库名称
        user='root',   # 数据库用户名
        password='abc123'  # 数据库密码
    )

    if connection.is_connected():
        cursor = connection.cursor(dictionary=True)  # 使用字典游标
        sql_query = "SELECT Comment_Content FROM comment"  # 替换为实际需要的字段和表名
        cursor.execute(sql_query)

        # 获取所有行
        records = cursor.fetchall()

        # 打印记录数量
        print(f"Total number of rows in table: {cursor.rowcount}")

        # 处理每一行数据
        summaries = [record['Comment_Content']
                     for record in records if 'Comment_Content' in record and record['Book_Introduce']]
        
        # 加载停用词表
        with open('stop_words_full.txt', 'r', encoding='utf-8') as f:
            stopwords = set(f.read().splitlines())

        # 分词和过滤
        words = []
        for summary in summaries:
            seg_list = jieba.lcut(summary)
            for word in seg_list:
                if word not in stopwords and len(word.strip()) > 0:
                    words.append(word)

        # 统计词频
        word_counts = Counter(words)

        # 转换为ECharts词云所需格式
        word_freq_data = [{"name": word, "value": count}
                          for word, count in word_counts.items()]
        
        # 将word_freq_data转换为JSON字符串并保存到文件
        output_file_path = 'word_freq.json'
        with open(output_file_path, 'w', encoding='utf-8') as json_file:
            json.dump(word_freq_data, json_file, ensure_ascii=False, indent=4)
        
        print(f"Word frequency data has been saved to {output_file_path}")

except Error as e:
    print("Error while connecting to MySQL", e)
finally:
    if connection and connection.is_connected():
        cursor.close()
        connection.close()
        print("MySQL connection is closed")