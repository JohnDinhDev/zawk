FROM php:fpm

ADD https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/

RUN chmod +x /usr/local/bin/install-php-extensions && sync && \
    install-php-extensions gd zip exif mysqli imagick

RUN docker-php-ext-enable mysqli imagick
# RUN docker-php-ext-install mysqli && docker-php-ext-enable mysqli
