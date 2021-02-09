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

# General steps

The general steps are:
1. Create <strong>sasl_passwd</strong> file which contains the plaintext credentials for google
2. Generate <strong>sasl_passwd.db</strong> file which is used by postfix
3. Create a <strong>tls_policy</strong> file which contains a plaintext version of the tls_policy used by postfix
4. Generate <strong>tls_policy.db</strong> file which is used by postfix
5. Edit settings and references to previous files in postfix main configuration file <strong>main.cf</strong>

## 1. Create <strong>sasl_passwd</strong> file
Create a new file: <em>/etc/postfix/sasl_passwd</em> with content:
```bash
[smtp.gmail.com]:587 USER@DOMAIN:PASSWORD
```

Where
```bash
USER = your gmail or gsuite username
DOMAIN = gmail.com or yourgsuitedomain.com
PASSWORD = the app password you previously created
```

## 2. generate <strong>sasl_passwd.db</strong>
<p><code>cd /etc/postfix<br />
postmap /etc/postfix/sasl_passwd</code><br />
This command generates the sasl_passwd.db file.</p>
<h2>3. create a <strong>tls_policy</strong></h2>
<p>Create another file: <em>/etc/postfix/tls_policy</em>:</p>
<pre>[smtp.gmail.com]:587 encrypt</pre>
<h2>4. generate <strong>tls_policy.db</strong></h2>
<p><code>postmap /etc/postfix/tls_policy</code><br />
This generates the tls_policy.db file</p>
<h2>5. edit postfix <strong>main.cf</strong> configuration file</h2>
<p>Now add/ensure the following configuration parameters are set</p>
<h3>5.1 TLS settings</h3>
<pre># TLS parameters
smtpd_tls_cert_file=/etc/ssl/certs/ssl-cert-snakeoil.pem
smtpd_tls_key_file=/etc/ssl/private/ssl-cert-snakeoil.key
smtpd_use_tls=yes
smtpd_tls_session_cache_database = btree:${data_directory}/smtpd_scache
smtp_tls_session_cache_database = btree:${data_directory}/smtp_scache
smtp_tls_policy_maps = hash:/etc/postfix/tls_policy</pre>
<h3>5.2 Host and Relay Configuration</h3>
<p>replace HOSTNAME with the actual FQDN of the VPS on which you are configuring postfix</p>
<pre>myhostname = HOSTNAME
mydestination = HOSTNAME, localhost, localhost.localdomain, localhost
relayhost = [smtp.gmail.com]:587
</pre>
<h3>5.3 Gmail SASL Configuration</h3>
<p>! One of my sources incorrectly stated that the sasl_mechanism should be <strong>plain</strong>, however this didn't work for me, however <strong>login</strong> did!</p>
<pre># Enable SASL authentication (for Gmail)
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_sasl_tls_security_options = noanonymous
#smtp_sasl_mechanism_filter = plain
smtp_sasl_mechanism_filter = login
smtp_tls_security_level = encrypt
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt</pre>
<h2>Finalize</h2>
<p>After changing everything, just restart postfix and send a test email with:<br />
<code>systemctl restart postfix<br />
echo "this is a test email" | mail -s test youremail@gmail.com</code></p>
<h2>Sources</h2>
<ul>
<li># https://linode.com/docs/email/postfix/configure-postfix-to-send-mail-using-gmail-and-google-apps-on-debian-or-ubuntu/</li>
<li>https://serverfault.com/questions/627128/postfix-sasl-authentication-failed-internal-authentication-error</li>
</ul>
<h2>Debugging</h2>
<p>If you run into errors it might be useful to check the following files for information</p>
<pre>/var/log/mail.log
/var/log/mail.err
</pre>
