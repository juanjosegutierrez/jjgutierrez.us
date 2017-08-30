# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.test import TestCase
from webapp.models import Users
from django.db import connection
import json

class ViewTests(TestCase):
	def test_index(self):
		res = self.client.get('/')
		self.assertEqual(res.status_code, 200)
	
	def test_calculate(self):
		ajax = {'HTTP_X_REQUESTED_WITH': 'XMLHttpRequest'}
		res = self.client.get('/calculate/', {'input': 6}, **ajax)
		data = json.loads(res.content)
		self.assertEqual(data['number'], '8')

	def test_register(self):
		ajax = {'HTTP_X_REQUESTED_WITH': 'XMLHttpRequest'}
		data = json.dumps({
			'name': 'test1',
			'email': '*',
			'username': 'test1',
			'password': 'test1'
		})
		res = self.client.post('/register/', data, content_type='application/json', **ajax)
		self.assertEqual(res.status_code, 201)
		res = self.client.post('/register/', data, content_type='application/json', **ajax)
		self.assertEqual(res.status_code, 400)
		self.assertTrue(res.content == 'username taken')

	def test_authenticate(self):
		ajax = {'HTTP_X_REQUESTED_WITH': 'XMLHttpRequest'}
		data = json.dumps({
			'name': 'test1',
			'email': '*',
			'username': 'test1',
			'password': 'test1'
		})
		login = json.dumps({
			'username': 'test1',
			'password': 'test1'
		})
		res = self.client.post('/auth/', login, content_type='application/json', **ajax)
		self.assertTrue(res.content == 'False')
		self.client.post('/register/', data, content_type='application/json', **ajax)
		res = self.client.post('/auth/', login, content_type='application/json', **ajax)
		self.assertTrue(res.content == 'True')

	def test_check_db(self):
		ajax = {'HTTP_X_REQUESTED_WITH': 'XMLHttpRequest'}
		data = json.dumps({
			'name': 'test1',
			'email': '*',
			'username': 'test1',
			'password': 'test1'
		})
		email = json.dumps({
			'email': '*'
		})
		res = self.client.post('/check/db/', email, content_type='application/json', **ajax)
		self.assertTrue(res.content == 'email not found')
		self.assertEqual(res.status_code, 400)
		self.client.post('/register/', data, content_type='application/json', **ajax)
		res = self.client.post('/check/db/', email, content_type='application/json', **ajax)
		self.assertTrue(res.content == 'found')
		self.assertEqual(res.status_code, 201)

	def test_valid(self):
		ajax = {'HTTP_X_REQUESTED_WITH': 'XMLHttpRequest'}
		fake_email = json.dumps({'email': 'fake'})
		real_email = json.dumps({'email': '*'})
		res = self.client.post('/check/valid/', fake_email, content_type='application/json', **ajax)
		self.assertTrue(res.content == 'invalid email')
		self.assertEqual(res.status_code, 400)
		res = self.client.post('/check/valid/', real_email, content_type='application/json', **ajax)
		self.assertTrue(res.content == 'valid')
		self.assertEqual(res.status_code, 201)

	def test_email(self):
		ajax = {'HTTP_X_REQUESTED_WITH': 'XMLHttpRequest'}
		data = json.dumps({
			'email': '*',
			'code': '203'
		})
		res = self.client.post('/email/', data, content_type='application/json', **ajax)
		self.assertEqual(res.status_code, 201)

	def test_update(self):
		ajax = {'HTTP_X_REQUESTED_WITH': 'XMLHttpRequest'}
		data = json.dumps({
			'name': 'test1',
			'email': '*',
			'username': 'test1',
			'password': 'test1'
		})
		new_info = json.dumps({
			'email': '*',
			'password': 'test2'
		})
		self.client.post('/register/', data, content_type='application/json', **ajax)
		res = self.client.post('/update/', new_info, content_type='application/json', **ajax)
		self.assertTrue(res.content == 'changed')
		self.assertEqual(res.status_code, 201)

class DatabaseTests(TestCase):
	def test_db_exists(self):
		is_created = 'webapp_users' in connection.introspection.table_names()
		self.assertTrue(is_created == True)

	def test_table_content(self):
		entry = Users(name='bob', email='email', username='test1', password='something')
		entry.save()
		query = Users.objects.filter(username='test1')
		for i in query:
			name = i.name
		self.assertTrue(name == 'bob')
