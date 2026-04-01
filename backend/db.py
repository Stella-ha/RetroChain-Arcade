import mysql.connector
from mysql.connector import Error

def get_connection():
    return mysql.connector.connect(
        host='localhost',
        database='retro_arcade',
        user='root',
        password='admin@123'
    )
