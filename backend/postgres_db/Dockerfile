FROM library/postgres

ARG PG_PASSWORD
ARG PG_USER
ARG PG_DB
ARG DEV_USER
ARG DEV_PASSWORD
ARG DEV_DB

ENV POSTGRES_PASSWORD $PG_PASSWORD
ENV POSTGRES_USER     $PG_USER
ENV POSTGRES_DB       $PG_DB
ENV DEV_USER          $DEV_USER
ENV DEV_PASSWORD      $DEV_PASSWORD
ENV DEV_DB            $DEV_DB

# Copy folder contents instead of the whole folder,
# otherwise the checksum and cache will not be invalidated if the file contents change
COPY /init/* docker-entrypoint-initdb.d/
COPY /sql/* tmp/