const axios = require('axios');
var express = require('express');
var router = express.Router();

// Configure the Axios interceptors outside the route handler
axios.interceptors.request.use(
  request => {
    request.headers["startTime"] = new Date();
    request.headers["secretKey"] = "123456";
    console.log("Request Headers:", request.headers);
    return request;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor that adds a custom header to the Axios response object
axios.interceptors.response.use(
  response => {
    // Add custom property to the Axios response headers
    response.headers["organizationVerified"] = true;
    console.log("Response headers after interceptor:", response.headers);
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);

/* GET users listing. */
router.get('/', function(req, res, next) {
  // Make the API requests
  const promise1 = axios.get("https://jsonplaceholder.typicode.com/todos/1");
  const promise2 = axios.get("https://jsonplaceholder.typicode.com/users/1");
  const promise3 = axios.get("https://jsonplaceholder.typicode.com/posts/1");

  Promise.all([promise1, promise2, promise3])
    .then(function(results) {
      // Access the custom header you added in the interceptor
      const isVerified1 = results[0].headers.organizationVerified;
      const isVerified2 = results[1].headers.organizationVerified;
      const isVerified3 = results[2].headers.organizationVerified;
      
      console.log("Todo API verified:", isVerified1);
      console.log("User API verified:", isVerified2);
      console.log("Post API verified:", isVerified3);
      
      // You can also forward this information to your client
      res.set("apiVerified", String(isVerified1 && isVerified2 && isVerified3));
      
      const combinedData = {
        todosData: results[0].data,
        usersData: results[1].data,
        postsData: results[2].data,
        // Include verification status in the response body if needed
        verification: {
          todosVerified: isVerified1,
          usersVerified: isVerified2,
          postsVerified: isVerified3
        }
      };
      
      res.json(combinedData);
    })
    .catch(function(e) {
      console.log(e);
      res.status(500).send('Error fetching concurrent data');
    });
});

module.exports = router;