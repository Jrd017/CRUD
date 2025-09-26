const Employee = require('../models/Employee');

const employeeController = {};

// Display list of all employees
employeeController.list = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.render('employee/index', { 
      employees: employees,
      title: 'Employee Management System'
    });
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).render('error', { 
      message: 'Error fetching employees',
      error: err 
    });
  }
};

// Display specific employee by id
employeeController.show = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).render('error', { 
        message: 'Employee not found',
        error: { status: 404 }
      });
    }
    res.render('employee/show', { 
      employee: employee,
      title: 'Employee Details'
    });
  } catch (err) {
    console.error('Error fetching employee:', err);
    res.status(500).render('error', { 
      message: 'Error fetching employee',
      error: err 
    });
  }
};

// Display form to create new employee
employeeController.create = (req, res) => {
  res.render('employee/create', { 
    title: 'Add New Employee',
    errors: null,
    employee: {}
  });
};

// Save new employee
employeeController.save = async (req, res) => {
  try {
    const employee = new Employee({
      name: req.body.name,
      address: req.body.address,
      position: req.body.position,
      salary: req.body.salary
    });
    
    await employee.save();
    console.log('Successfully created employee:', employee.name);
    res.redirect('/employees/show/' + employee._id);
  } catch (err) {
    console.error('Error saving employee:', err);
    
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(400).render('employee/create', { 
        errors: errors,
        employee: req.body,
        title: 'Add New Employee'
      });
    }
    
    res.status(500).render('error', { 
      message: 'Error saving employee',
      error: err 
    });
  }
};

// Display form to edit employee
employeeController.edit = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).render('error', { 
        message: 'Employee not found',
        error: { status: 404 }
      });
    }
    
    res.render('employee/edit', { 
      employee: employee,
      title: 'Edit Employee',
      errors: null
    });
  } catch (err) {
    console.error('Error fetching employee for edit:', err);
    res.status(500).render('error', { 
      message: 'Error fetching employee',
      error: err 
    });
  }
};

// Update employee
employeeController.update = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id, 
      {
        name: req.body.name,
        address: req.body.address,
        position: req.body.position,
        salary: req.body.salary
      },
      { 
        new: true,
        runValidators: true
      }
    );
    
    if (!employee) {
      return res.status(404).render('error', { 
        message: 'Employee not found',
        error: { status: 404 }
      });
    }
    
    console.log('Successfully updated employee:', employee.name);
    res.redirect('/employees/show/' + employee._id);
  } catch (err) {
    console.error('Error updating employee:', err);
    
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(400).render('employee/edit', { 
        employee: req.body,
        errors: errors,
        title: 'Edit Employee'
      });
    }
    
    res.status(500).render('error', { 
      message: 'Error updating employee',
      error: err 
    });
  }
};

// Delete employee
employeeController.delete = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    
    if (!employee) {
      return res.status(404).render('error', { 
        message: 'Employee not found',
        error: { status: 404 }
      });
    }
    
    console.log('Successfully deleted employee:', employee.name);
    res.redirect('/employees');
  } catch (err) {
    console.error('Error deleting employee:', err);
    res.status(500).render('error', { 
      message: 'Error deleting employee',
      error: err 
    });
  }
};

module.exports = employeeController;