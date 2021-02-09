---
title: Configure postfix with Gmail as relayhost
date: 2018-05-03
category:
  - articles
tags:
  - linux
  - postfix
  - sendmail
  - gmail
  - gsuite
  - smtp

---

On Linux servers it is often useful to be able to send e-mail for logging and alerting.\
When using a VPS setup of the SMTP service is often not included and needs to be configured manually.\
As Google already has a pretty good mail service with Gmail, it's useful to use this for relaying your emails.\
In this post we will discuss the requirements for using gmail as a relayhost and steps necessary to configure postfix.\

As Google services require credentials and you shouldn't use your own username and password for login,
it's a good idea to create an "app password" for the postfix service, instructions can be found
<a href="https://support.google.com/mail/answer/185833?hl=en" target="_blank" rel="noopener">here</a>.

After creating the app password we can login to the VPS and configure Postfix.\
**! Be aware there are many instructions available online, but I found many of them incomplete or just plain wrong.**

# Outline

The general steps are:
1. Create <strong>sasl_passwd</strong> file which contains the plaintext credentials for google
2. Generate <strong>sasl_passwd.db</strong> file which is used by postfix
3. Create a <strong>tls_policy</strong> file which contains a plaintext version of the tls_policy used by postfix
4. Generate <strong>tls_policy.db</strong> file which is used by postfix
5. Edit settings and references to previous files in postfix main configuration file <strong>main.cf</strong>

# 1. Create <strong>sasl_passwd</strong> file
Create a new file: <em>/etc/postfix/sasl_passwd</em> with content:
```bash
[smtp.gmail.com]:587 USER@DOMAIN:PASSWORD

# Where
USER = your gmail or gsuite username
DOMAIN = gmail.com or yourgsuitedomain.com
PASSWORD = the app password you previously created
```

# 2. Generate <strong>sasl_passwd.db</strong>
This command generates the sasl_passwd.db file.
```bash
cd /etc/postfix
postmap /etc/postfix/sasl_passwd
```

# 3. Create a <strong>tls_policy</strong>
Create another file: <em>/etc/postfix/tls_policy</em>:
```bash
[smtp.gmail.com]:587 encrypt
```

# 4. Generate <strong>tls_policy.db</strong>

Generate the tls_policy.db file
```bash
postmap /etc/postfix/tls_policy
```

# 5. Edit postfix <strong>main.cf</strong> configuration file
Now add/ensure the following configuration parameters are set

## 5.1 TLS settings
```bash
# TLS parameters
smtpd_tls_cert_file=/etc/ssl/certs/ssl-cert-snakeoil.pem
smtpd_tls_key_file=/etc/ssl/private/ssl-cert-snakeoil.key
smtpd_use_tls=yes
smtpd_tls_session_cache_database = btree:${data_directory}/smtpd_scache
smtp_tls_session_cache_database = btree:${data_directory}/smtp_scache
smtp_tls_policy_maps = hash:/etc/postfix/tls_policy
```

## 5.2 Host and Relay Configuration
Replace HOSTNAME with the actual FQDN of the VPS on which you are configuring postfix
```bash
myhostname = HOSTNAME
mydestination = HOSTNAME, localhost, localhost.localdomain, localhost
relayhost = [smtp.gmail.com]:587
```

## 5.3 Gmail SASL Configuration
! One of my sources incorrectly stated that the sasl_mechanism should be <strong>plain</strong>, however this didn't work for me, however <strong>login</strong> did!

```bash
# Enable SASL authentication (for Gmail)
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_sasl_tls_security_options = noanonymous
#smtp_sasl_mechanism_filter = plain
smtp_sasl_mechanism_filter = login
smtp_tls_security_level = encrypt
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
```

# Finalize
After changing everything, just restart postfix and send a test email with:
```bash
systemctl restart postfix
echo "this is a test email" | mail -s test youremail@gmail.com
```

# Debugging
If you run into errors it might be useful to check the following files for information
```bash
/var/log/mail.log
/var/log/mail.err
```

# Sources

1. [https://linode.com/docs/email/postfix/configure-postfix-to-send-mail-using-gmail-and-google-apps-on-debian-or-ubuntu/](https://linode.com/docs/email/postfix/configure-postfix-to-send-mail-using-gmail-and-google-apps-on-debian-or-ubuntu/)
2. [https://serverfault.com/questions/627128/postfix-sasl-authentication-failed-internal-authentication-error](https://serverfault.com/questions/627128/postfix-sasl-authentication-failed-internal-authentication-error)

