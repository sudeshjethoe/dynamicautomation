---
title: Configuring NFS on Fonera 2.0n
date: 2012-01-06
categories:
- articles
tags:
- linux
- fon
- nfs
---

# Install NFS

```bash
opkg install unfs3
```

# Edit hosts

Edit hosts.deny:
```bash
echo 'ALL: ALL' > /etc/hosts.deny
```

Edit hosts.allow:
```bash
echo '192.168.1.' > /etc/hosts.allow
```
# Set exports
Edit /etc/exports (with vi and enter):
```bash
/tmp/mounts/Disc-A1/music (ro,async,insecure,root_squash,proto=udp,anonuid=65534,anongid=65534)
/tmp/mounts/Disc-A1/videos (ro,async,insecure,root_squash,proto=udp,anonuid=65534,anongid=65534)
/tmp/mounts/Disc-A1/pictures (ro,async,insecure,root_squash,proto=udp,anonuid=65534,anongid=65534)
/tmp/mounts/Disc-A1/my_home (rw,sync,secure,root_squash,proto=tcp,anonuid=65534,anongid=65534)
```
# Start service
Start service:
```bash
/etc/init.d/portmap start &amp;&amp; sleep 3 &amp;&amp; /etc/init.d/unfs3 start
```

# Enable persistence
To enable automatic restart on reboot
```bash
/etc/init.d/portmap enable &amp;&amp; /etc/init.d/unfs3 enable
```
Set the following parameters according to your preference:
```bash
allow > deny
ro: read only
async: unsafe, no file locking but faster
insecure: allow ports over 1024 to connect
root_squash: remote root is converted to anonuid+anongid
anonuid: server uid of anonymous user
anongid: server gid of anonymous user
```
*! uid's and gid's are mapped one to one (possible security risk)*\
http://wiki.fon.com/wiki/F2_NFS

Now for pure awesomeness enable automount* on your client:\
Easy as: `yum install autofs`
And add the following too
```bash
# /etc/auto.misc #
#
# local entries
fon-svjethoe -fstype=nfs,rw,tcp,rsize=32768,wsize=32768 fonera:/tmp/mounts/Disc-A1/svjethoe
fon-music -fstype=nfs,rsize=32768,wsize=32768 :/tmp/mounts/Disc-A1/music
fon-pictures -fstype=nfs,rsize=32768,wsize=32768 :/tmp/mounts/Disc-A1/pictures
fon-videos -fstype=nfs,rsize=32768,wsize=32768 :/tmp/mounts/Disc-A1/videos
# vpn entries
fon-svjethoe -fstype=nfs,rw,tcp,rsize=32768,wsize=32768 10.8.0.1:/tmp/mounts/Disc-A1/svjethoe
fon-music -fstype=nfs,rsize=32768,wsize=32768 :/tmp/mounts/Disc-A1/music
fon-pictures -fstype=nfs,rsize=32768,wsize=32768 :/tmp/mounts/Disc-A1/pictures
fon-videos -fstype=nfs,rsize=32768,wsize=32768 :/tmp/mounts/Disc-A1/videos
```

Now the folders will be automatically mounted when accessed (defaults under /misc ->)
* `rsize=` transfer block size for reads in bytes (=32bytes=max=nfs4 default)\
* `wsize=` transfer block size for writes in bytes ( "" """" "")\
* `default` rsize+wsize in nfs3= 8 bytes

Just run `cd /misc/fon-music` and you're there!\
[http://fedoraproject.org/wiki/Administration_Guide_Draft/NFS](http://fedoraproject.org/wiki/Administration_Guide_Draft/NFS)

