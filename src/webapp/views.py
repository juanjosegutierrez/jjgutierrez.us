# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from webapp.models import Users
from django.contrib.auth.hashers import make_password, check_password
from sendgrid.helpers.mail import *
import json
import sendgrid
import requests

# Create your views here.
def calculate(request):
	if request.method == 'GET' and request.is_ajax():
		n = int(request.GET['input'])
		a = 0
		b = 1
		if n == 0:
			result = a
		elif n == 1:
			result = b
		else:
			for i in range(2, n + 1):
				c = a + b
				a = b
				b = c
			result = b
		return HttpResponse(json.dumps({'number': str(result)}), content_type="application/json")
	else:
		return HttpResponse('Request not GET or not AJAX')

def register(request):
	if request.method == 'POST' and request.is_ajax():
		data = json.loads(request.body)
		username_query = Users.objects.filter(username=data['username'])
		if username_query.count() > 0:
			return HttpResponse('username taken', status=400)
		email_query = Users.objects.filter(email=data['email'])
		if email_query.count() > 0:
			return HttpResponse('email taken', status=400)
		password = make_password(data['password'])
		b = Users(name=data['name'], email=data['email'], username=data['username'], password=password)
		b.save()
		return HttpResponse('done', status=201)
	else:
		return HttpResponse('Request not POST or not AJAX')

def authenticate(request):
	if request.method == 'POST' and request.is_ajax():
		data = json.loads(request.body)
		username = data['username']
		query = Users.objects.filter(username=username)
		db_password = ''
		for i in query:
			db_password = i.password
		allow = check_password(data['password'], db_password)
		return HttpResponse(allow, status=201)
	else:
		return HttpResponse('Request not POST or not AJAX')

def check_db(request):
	if request.method == 'POST' and request.is_ajax():
		data = json.loads(request.body)
		query = Users.objects.filter(email=data['email'])
		if query.count() == 0:
			return HttpResponse('email not found', status=400)
		return HttpResponse('found', status=201)
	else:
		return HttpResponse('Request not POST or not AJAX')

def valid(request):
	if request.method == 'POST' and request.is_ajax():
		data = json.loads(request.body)
		mail_response = requests.get(
			'https://api.mailgun.net/v3/address/validate',
			auth=('api', ''),
			params={'address': data['email']})
		mail_response = json.loads(mail_response.text)
		if mail_response['is_valid'] != True:
			return HttpResponse('invalid email', status=400)
		return HttpResponse('valid', status=201)
	else:
		return HttpResponse('Request not POST or not AJAX')

def email(request):
	if request.method == 'POST' and request.is_ajax():
		data = json.loads(request.body)
		sg = sendgrid.SendGridAPIClient(apikey='')
		from_email = Email('')
		to_email = Email(data['email'])
		subject = 'Password Recovery - jjgutierrez.us'
		content = Content('text/plain', 'Your security code is ' + data['code'])
		mail = Mail(from_email, subject, to_email, content)
		response = sg.client.mail.send.post(request_body=mail.get())
		return HttpResponse(status=201)
	else:
		return HttpResponse('Request not POST or not AJAX')

def update(request):
	if request.method == 'POST' and request.is_ajax():
		data = json.loads(request.body)
		password = make_password(data['password'])
		Users.objects.filter(email=data['email']).update(password=password)
		return HttpResponse('changed', status=201)
	else:
		return HttpResponse('Request not POST or not AJAX')
