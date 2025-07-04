from celery import shared_task
import subprocess
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent

@shared_task
def ejecutar_scraping():
    script_path = BASE_DIR / 'scraping' / 'scraping.py'
    subprocess.run(['python', script_path], check=True)
    
@shared_task
def ejecutar_poblar_bd(*args, **kwargs):
    manage_path = BASE_DIR / 'manage.py'
    subprocess.run(['python', str(manage_path), 'poblar_bd'], check=True)