from django.core.management.base import BaseCommand
from scraping.tasks import ejecutar_scraping, ejecutar_poblar_bd
from celery import chain

class Command(BaseCommand):
    help = 'Ejecuta manualmente las tareas de scraping y poblar_bd con Celery'
    
    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS('Enviando cadena de tarea: ejecutar_scraping y ejecutar_poblar_bd'))
        chain(
            ejecutar_scraping.s(),
            ejecutar_poblar_bd.s()
        )()

        self.stdout.write(self.style.SUCCESS('Cadena de tareas enviada correctamente a Celery.'))

        