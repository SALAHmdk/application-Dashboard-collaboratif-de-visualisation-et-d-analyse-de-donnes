from weasyprint import HTML
from jinja2 import Environment, FileSystemLoader
import os

def generate_pdf(data: dict, filename="rapport.pdf"):
    env = Environment(loader=FileSystemLoader("app/templates"))
    template = env.get_template("rapport.html")
    html_out = template.render(data=data)
    HTML(string=html_out).write_pdf(target=filename)
