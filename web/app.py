from flask import Flask, request, jsonify
import mysql.connector
from mysql.connector import Error
from flask_cors import CORS  # 引入CORS

app = Flask(__name__)

# 启用CORS，允许跨域请求
CORS(app)

# 配置MySQL数据库连接
db_config = {
    'host': '127.0.0.1',  # 数据库主机名
    'user': 'root',  # MySQL用户名
    'password': 'ht631414',  # MySQL密码
    'database': 'website_db'  # 数据库名称
}

def connect_to_database():
    try:
        connection = mysql.connector.connect(**db_config)
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

@app.route('/submit_form', methods=['POST'])
def submit_form():
    try:
        # 从前端接收JSON数据
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        message = data.get('message')

        # 连接数据库
        connection = connect_to_database()
        if connection is None:
            return jsonify({'status': 'error', 'message': 'Database connection failed'}), 500

        cursor = connection.cursor()
        sql = "INSERT INTO form_submissions (name, email, message) VALUES (%s, %s, %s)"
        values = (name, email, message)
        cursor.execute(sql, values)
        connection.commit()

        cursor.close()
        connection.close()

        # 返回成功信息
        return jsonify({'status': 'success', 'message': 'Form submitted successfully!'}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'status': 'error', 'message': 'An error occurred'}), 500

if __name__ == '__main__':
    # 启动Flask服务器，监听5000端口
    app.run(host='0.0.0.0', port=5000, debug=True)
