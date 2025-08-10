from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    h_password = pwd_context.hash(password)
    print("Hashing password", h_password)
    return h_password

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)
