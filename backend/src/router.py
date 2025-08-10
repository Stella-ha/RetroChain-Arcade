from fastapi import APIRouter, HTTPException
from db import get_connection
from utils import hash_password, verify_password
from src.models import RegisterRequest, LoginRequest

router = APIRouter()

@router.post("/register")
def register(request: RegisterRequest):
    username = request.username
    email = request.email
    password = request.password
    print(f"Registering user: {username}, email: {email}")
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM users WHERE email = %s OR username = %s", (email, username))
    existing = cursor.fetchone()
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    hashed_pw = hash_password(password)
    cursor.execute(
        "INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s)",
        (username, email, hashed_pw)
    )
    conn.commit()
    return {"message": "User registered successfully"}

@router.post("/login")
def login(request: LoginRequest):
    email = request.email
    password = request.password
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()
    if not user or not verify_password(password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {"message": "Login successful", "user_id": user["id"]}
