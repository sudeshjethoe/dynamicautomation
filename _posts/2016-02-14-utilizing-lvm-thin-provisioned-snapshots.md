---
title: Utilizing lvm thin provisioned snapshots
date: 2016-02-14
toc: false
category:
- articles
tags:
- linux
- lvm

---

To fully utilize the few bits of space which is provided by my SSD, I always take the following approach:
1. Create an "as large as possible" LVM volume group to hold all my data.
2. Create a thin_pool within the volume group for my virtual machines.
3. Create one "base VM" which contains just a bare installation of my preferred OS (inside the thinpool).
4. Now for each VM I need for my labs I create a snapshot from the base VM

```bash
lvcreate --snapshot --name thin_snapshot vg/thin_base
```

5. Now to ensure that I can actually utilize the newly created snapshot I have to activate it first.

LVM (thin) snapshot are "by default" created in inactivated mode, but it also has the "<a href="http://man7.org/linux/man-pages/man7/lvmthin.7.html#Thin_Topics" target="_blank">activation skip flag</a>". This flag prevents the system from activing the partition with the usual commands. To active the partition use:

```bash
lvchange -ay -K vg/thin_snapshot
```

To remove the skip flag completely add:

```bash
lvchange -kn vg/thin_snapshot
```

Finally the newly added thinly provisioned snapshot is available for usage by my virtualisation tool.

