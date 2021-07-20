FROM stilliard/pure-ftpd

CMD /run.sh -c 30 -C 10 -l puredb:/etc/pure-ftpd/pureftpd.pdb -E -j -R -P $PUBLICHOST -p 30000:30059

RUN mkdir /home/wordpress
RUN chown -R www-data:www-data /home/wordpress
