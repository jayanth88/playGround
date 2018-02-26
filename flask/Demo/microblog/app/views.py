from app import app
from flask import flash,redirect,render_template
from .forms import LoginForm

@app.route('/')
@app.route('/index')
def index():
	posts = [
		{
			'author': {'nickname' : 'John'},
			'body': 'Beautiful day in Portland'},
		{
			'author':{'nickname':'Susan'},
			'body':'The Avengers movie was cool'}
	]
	user = {'nickname': 'jpk'}
	return render_template('index.html',
				title='Sign In',	
				user=user,
				posts=posts)

@app.route('/login', methods=['GET','POST'])
def login():
	form=LoginForm()
	if form.validate_on_submit():
		flash('Login requested from OpenID="%s", remeber_me=%s' %(form.openid.data, str(form.remember_me.data)))
		return redirect('/index')
	return render_template('login.html',
				titiel='Sign In',
				form=form,
				providers=app.config['OPENID_PROVIDERS'])
