function greeter(person) {
    return "Hello" + person.firstName + " " + person.lastName;
}
var user = { firstName: "Jack", lastName: "Reacher" };
document.body.innerHTML = greeter(user);
var Student = (function () {
    function Student(firstName, middleName, lastName) {
        this.firstName = firstName;
        this.middleName = middleName;
        this.lastName = lastName;
        this.fullName = firstName + " " + middleName + " " + lastName;
    }
    return Student;
}());
var stu = new Student("Jane", "M.", "User");
document.body.innerHTML = greeter(stu);
