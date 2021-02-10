---
title: Installing an SSD (Fedora 16)
date: 2015-03-08
category:
- articles
tags:
- linux
- fedora
- ssd
- btrfs

---

I just bought an SSD drive and I want to make sure it works best as it can.\
I migrate my old / (ext4) partition to this drive.\
For best performance I decide to switch to a GPT-based disk layout and use btrfs for the filesystem.\

# Install SSD and configure partition table

First step is to physically install the disk into your laptop\
After, boot from livecd/usb (systemrescuecd) and create GPT partition table and partitions, using gdisk (g fdisk).\
Create at least two partitions!

* ..BIOS_boot partition code: EF02 size: 1 MiB
* ..Linux/Windows data, root partition code: 0700 size: any

**! gdisk automatically aligns partitions on 2048-sector boundaries for best performance.**

# Format root partition as btrfs

```bash
mkfs.btrfs -L MyLinuxOS /dev/sda2
```

# Copy data from old to new partition

Copy data from old partition to new partition using rsync with -a(rchive) option to make sure all filepermissions are preserved.

# Install Grub2 on new partition

```bash
mount /dev/sda2 /mnt
mount -o bind /dev /mnt/dev
mount -t proc /proc /mnt/proc
mount -t sysfs /sys /mnt/sys
chroot /mnt
# possibly fedora specific:
grub2-mkconfig -o /boot/grub2/grub.cfg
grub2-install /dev/sda
```

# Edit fstab to use on startup

```bash
# /etc/fstab #
LABEL=Fedora / btrfs defaults,noatime,discard,ssd 0 0
```

# Sources

* [https://wiki.archlinux.org/index.php/Solid_State_Drives](https://wiki.archlinux.org/index.php/Solid_State_Drives)
* [http://tincman.wordpress.com/2011/01/20/installing-arch-linux-onto-a-gpt-partitioned-btrfs-root-ssd-on-a-legacy-bios-system/](http://tincman.wordpress.com/2011/01/20/installing-arch-linux-onto-a-gpt-partitioned-btrfs-root-ssd-on-a-legacy-bios-system/)
* [http://fedoraproject.org/wiki/Grub2](http://fedoraproject.org/wiki/Grub2)
* [ArchLinux SSD tutorial]("https://wiki.archlinux.org/index.php/Solid_State_Drives")
