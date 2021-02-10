---
title: Access Unix NFS shares from Windows XP
date: 2012-01-06
category:
- articles
tags:
- linux
- nfs
- windows xp

---

## 1. Install Windows Services for UNIX

[Windows Services for UNIX]("http://www.microsoft.com/download/en/details.aspx?id=274") (latest at time of writing 3.5)

## 2. Set passwd and group file on Unix server

Create a directory for the passwd and group file of the Unix server you want to access.\
(Windows needs to map local user to these accounts, else it won't work)

```bat
mkdir C:\etc
```

Copy the /etc/passwd and /etc/group files from the Unix machine to C:\etc\

## 3. Configure mapping services

Configure the mapping service to use these files for resolving user names, by running the following command:
```bat
C:\>mapadmin adddomain -d \\MY_COMPUTER -f C:\etc
```

Make sure to fill in the LOCAL computer name in at MY_COMPUTER\
You can check if it worked by typing:
```bat
C:\>mapadmin listdomainmaps

Windows domain to UNIX domain Mappings:
Windows Domain UNIX Domain
-------------------------------------------------------
\\MY_COMPUTER PCNFS (C:\etc\passwd)
```
You've just created a mapping from your windows host to your Unix host PCNFS.

## 4. Starting the services
To start the service, in <a href="http://support.microsoft.com/kb/324073">M$ documentation</a> it says 'mapadmin start', this doesn't work, you need to do the following:\
```bat
run services.msc
select 'User Name Mapping service' and enable this and START it
```

## 5. Map users
Now it's possible to map local (Windows) users to Unix users (and groups) in the etc/passwd file by running:
```bat
C:\>mapadmin add -wu MY_COMPUTER\win_user -uu PCNFS\unix_user
% and map groups:
C:\>mapadmin add -wg \\MY_COMPUTER\Users -ug PCNFS\users
% add guest accounts for squash:
C:\>mapadmin add -wu MY_COMPUTER\Guest -uu PCNFS\nobody
C:\>mapadmin add -wg \\MY_COMPUTER\Guests -ug PCNFS\nogroup
```
## 6. Anonymous access
If you wan't anonymous access you need to map Guest to the unix user nobody. (this remains to be tested however)
