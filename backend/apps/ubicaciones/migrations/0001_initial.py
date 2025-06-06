# Generated by Django 5.1.7 on 2025-03-25 03:15

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Ubicacion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('codigo', models.CharField(max_length=10, verbose_name='Código')),
                ('nombre', models.CharField(max_length=100, verbose_name='Nombre')),
                ('ciudad', models.CharField(max_length=50, verbose_name='Ciudad')),
                ('estado', models.CharField(max_length=50, verbose_name='Estado')),
                ('direccion', models.CharField(blank=True, max_length=255, null=True, verbose_name='Dirección')),
                ('activo', models.BooleanField(default=True, verbose_name='Activo')),
            ],
            options={
                'verbose_name': 'Ubicación',
                'verbose_name_plural': 'Ubicaciones',
                'ordering': ['nombre'],
            },
        ),
    ]
