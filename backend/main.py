from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from src.logger import logger
from src.router import router as auth_router

app = FastAPI()
app.include_router(auth_router)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

@app.middleware("http")
async def log_exceptions(request: Request, call_next):
    try:
        response = await call_next(request)
        return response
    except Exception as e:
        logger.error(f"Exception occurred: {str(e)}", exc_info=True)
        return JSONResponse(status_code=500, content={"message": "Internal Server Error", "error": str(e)})
    
app.include_router(auth_router)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)