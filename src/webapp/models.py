# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# Create your models here.
class Users(models.Model):
	name = models.CharField(max_length=80)
	email = models.CharField(max_length=80)
	username = models.CharField(max_length=255)
	password = models.CharField(max_length=255)
