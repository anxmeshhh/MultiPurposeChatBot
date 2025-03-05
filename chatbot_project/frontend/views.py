from django.shortcuts import render, redirect
import MySQLdb
from django.contrib import messages

def get_db_connection():
    try:
        return MySQLdb.connect(
            host="localhost", 
            user="root", 
            password="theanimesh2005", 
            database="legal_aid", 
            charset="utf8"
        )
    except MySQLdb.Error as e:
        print(f"Database Connection Error: {e}")
        return None

def signlogin(request):
    if request.method == "POST":
        action = request.POST.get("action", "").strip()

        if action == "signup":
            first_name = request.POST.get("firstName", "").strip()
            last_name = request.POST.get("lastName", "").strip()
            email = request.POST.get("signupEmail", "").strip()
            phone = request.POST.get("phone", "").strip()
            legal_issue_category = request.POST.get("legalIssue", "").strip()
            password = request.POST.get("signupPassword", "").strip()

            if not all([first_name, last_name, email, phone, legal_issue_category, password]):
                messages.error(request, "All fields are required!")
                return redirect('/signlogin/')

            try:
                conn = get_db_connection()
                if conn:
                    cursor = conn.cursor()
                    query = """INSERT INTO users (first_name, last_name, email, phone, legal_issue_category, password) 
                               VALUES (%s, %s, %s, %s, %s, %s)"""
                    cursor.execute(query, (first_name, last_name, email, phone, legal_issue_category, password))
                    conn.commit()
                    messages.success(request, "Account created successfully! Please login.")
                    return redirect('/home/')
            except MySQLdb.IntegrityError:
                messages.error(request, "Email already exists. Please use another email.")
            except Exception as e:
                messages.error(request, f"Error: {str(e)}")
                print(f"Signup Error: {e}")
            finally:
                if conn:
                    cursor.close()
                    conn.close()

        elif action == "login":
            email = request.POST.get("email", "").strip()
            password = request.POST.get("password", "").strip()

            if not email or not password:
                messages.error(request, "Email and password are required.")
                return redirect('/signlogin/')

            try:
                conn = get_db_connection()
                if conn:
                    cursor = conn.cursor()
                    query = "SELECT id, first_name FROM users WHERE email = %s AND password = %s"
                    cursor.execute(query, (email, password))
                    user = cursor.fetchone()

                    if user:
                        request.session['user_id'] = user[0]
                        request.session['user_name'] = user[1]
                        return redirect('/home/')
                    else:
                        messages.error(request, "Invalid email or password.")
            except Exception as e:
                messages.error(request, f"Error: {str(e)}")
                print(f"Login Error: {e}")
            finally:
                if conn:
                    cursor.close()
                    conn.close()

    return render(request, "signlogin.html")

def logout_view(request):
    request.session.flush()
    return redirect('/signlogin/')

def index(request):
    return render(request, "index.html")

def chat_page(request):
    return render(request, "chat.html")

def case(request):
    return render(request, "case.html")
