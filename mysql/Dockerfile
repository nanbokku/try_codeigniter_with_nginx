FROM mysql

COPY ./conf.d /etc/mysql/conf.d

# permission が 777 だと mysql が読んでくれないため
RUN chmod 644 /etc/mysql/conf.d/my.cnf

ENV MYSQL_DATABASE=todo_database
ENV MYSQL_ROOT_PASSWORD=root