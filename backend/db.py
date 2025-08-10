import mysql.connector
from mysql.connector import Error

def get_connection():
    return mysql.connector.connect(
        host='localhost',
        database='retro',
        user='root',
        password='root@1234'
    )
