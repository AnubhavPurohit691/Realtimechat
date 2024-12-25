# Use the official PostgreSQL image as the base image
FROM postgres:latest

# Set environment variables for PostgreSQL configuration
ENV POSTGRES_USER=myuser
ENV POSTGRES_PASSWORD=mypassword
ENV POSTGRES_DB=mydb

# Copy the custom initialization SQL script into the container
# COPY init.sql /docker-entrypoint-initdb.d/

# Expose PostgreSQL's default port
EXPOSE 5432
