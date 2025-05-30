# Generated by Django 5.1.7 on 2025-03-25 03:15

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('ubicaciones', '0001_initial'),
        ('usuarios', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='CategoriaEquipo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=50, verbose_name='Nombre')),
                ('descripcion', models.CharField(blank=True, max_length=255, null=True, verbose_name='Descripción')),
                ('activo', models.BooleanField(default=True, verbose_name='Activo')),
            ],
            options={
                'verbose_name': 'Categoría de Equipo',
                'verbose_name_plural': 'Categorías de Equipos',
                'ordering': ['nombre'],
            },
        ),
        migrations.CreateModel(
            name='EstadoEquipo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=30, verbose_name='Nombre')),
                ('descripcion', models.CharField(blank=True, max_length=255, null=True, verbose_name='Descripción')),
                ('permite_asignacion', models.BooleanField(default=True, verbose_name='Permite Asignación')),
            ],
            options={
                'verbose_name': 'Estado de Equipo',
                'verbose_name_plural': 'Estados de Equipos',
                'ordering': ['nombre'],
            },
        ),
        migrations.CreateModel(
            name='Fabricante',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=50, verbose_name='Nombre')),
                ('contacto', models.CharField(blank=True, max_length=100, null=True, verbose_name='Contacto')),
                ('telefono', models.CharField(blank=True, max_length=20, null=True, verbose_name='Teléfono')),
                ('sitio_web', models.CharField(blank=True, max_length=100, null=True, verbose_name='Sitio Web')),
                ('activo', models.BooleanField(default=True, verbose_name='Activo')),
            ],
            options={
                'verbose_name': 'Fabricante',
                'verbose_name_plural': 'Fabricantes',
                'ordering': ['nombre'],
            },
        ),
        migrations.CreateModel(
            name='Modelo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=50, verbose_name='Nombre')),
                ('tipo_componente', models.CharField(blank=True, max_length=50, null=True, verbose_name='Tipo de Componente')),
                ('especificaciones', models.TextField(blank=True, null=True, verbose_name='Especificaciones')),
                ('activo', models.BooleanField(default=True, verbose_name='Activo')),
                ('categoria', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='equipos.categoriaequipo', verbose_name='Categoría')),
                ('fabricante', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='equipos.fabricante', verbose_name='Fabricante')),
            ],
            options={
                'verbose_name': 'Modelo',
                'verbose_name_plural': 'Modelos',
                'ordering': ['nombre'],
            },
        ),
        migrations.CreateModel(
            name='Equipo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=50, verbose_name='Nombre')),
                ('serie', models.CharField(max_length=50, unique=True, verbose_name='Número de Serie')),
                ('sistema_operativo', models.CharField(blank=True, max_length=50, null=True, verbose_name='Sistema Operativo')),
                ('procesador', models.CharField(blank=True, max_length=50, null=True, verbose_name='Procesador')),
                ('memoria_ram', models.CharField(blank=True, max_length=20, null=True, verbose_name='Memoria RAM')),
                ('disco_duro', models.CharField(blank=True, max_length=50, null=True, verbose_name='Disco Duro')),
                ('direccion_ip', models.CharField(blank=True, max_length=20, null=True, verbose_name='Dirección IP')),
                ('fecha_compra', models.DateField(blank=True, null=True, verbose_name='Fecha de Compra')),
                ('fecha_fin_garantia', models.DateField(blank=True, null=True, verbose_name='Fecha Fin de Garantía')),
                ('observaciones', models.TextField(blank=True, null=True, verbose_name='Observaciones')),
                ('area', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='usuarios.area', verbose_name='Área')),
                ('categoria', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='equipos.categoriaequipo', verbose_name='Categoría')),
                ('ubicacion', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='ubicaciones.ubicacion', verbose_name='Ubicación')),
                ('estado', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='equipos.estadoequipo', verbose_name='Estado')),
                ('modelo', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='equipos.modelo', verbose_name='Modelo')),
            ],
            options={
                'verbose_name': 'Equipo',
                'verbose_name_plural': 'Equipos',
                'ordering': ['nombre'],
            },
        ),
    ]
