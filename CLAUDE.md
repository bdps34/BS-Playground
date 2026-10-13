
# About this repo

This is BS Playground, a learning project: a simple chatbot built with Angular and a Node / Express backend.

Make sure that all code uses the appropriate Angular best practices and examples as according to the Angular CLI MCP server.

The application is a simple chatbot based on the OpenAI API.  

The frontend is a signals-based, zoneless Angular application, and the backend is a plain Node / Express REST server that uses 
the OpenAI API.

## Global coding rules 

- always put model files in their own separate file.

- don't use single letter variables names, like "f" for form

- don't use _ prefixes for private variables 

# Typescript rules

- don't use void return types, those are inferred.

- don't use Promise return types in async functions, those are inferred.

- for custom object types, use type instead of interface.

