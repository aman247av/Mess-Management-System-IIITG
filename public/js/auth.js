document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission
  
    // Get form data
    const formData = new FormData(e.target);
    const formDataObject = Object.fromEntries(formData.entries());
  
    try {
      const response = await fetch('/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataObject),
      });
  
      const data = await response.json();
      console.log(data);
      // Handle response data, e.g., show a success message or redirect to another page
    } catch (error) {
      console.error('Error:', error);
      // Handle error, e.g., show an error message to the user
    }
  });
  