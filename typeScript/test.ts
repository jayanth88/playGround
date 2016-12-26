interface Person{
	firstName: string;
	lastName: string;
}


function greeter(person: Person){
	return "Hello" + person.firstName + " " + person.lastName;
}

var user = { firstName: "Jack" , lastName: "Reacher" };

document.body.innerHTML = greeter(user)


class Student{
	fullName : string;
	constructor(public firstName, public middleName, public lastName){
		this.fullName = firstName+" "+ middleName+ " "+lastName;
	}
}

var stu = new Student("Jane","M.","User");
document.body.innerHTML = greeter(stu);
