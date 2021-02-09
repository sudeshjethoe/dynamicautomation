---
title: Setup nagios event handlers using passive checks and NRPE
date: 2016-02-14
category:
- articles
tags:
- linux
- nagios
- nrpe
- nsca

---

# Introduction
Nagios event handlers allow nagios to automatically apply remedial actions when certain&nbsp;events occur (e.g. automatic restart of a service when it goes down).

The NSCA (Nagios Service Check Acceptor) daemon allows nagios to receive passive checks from&nbsp;hosts. Passive checks can be advantageous since they do not require the nagios server to&nbsp;initiate a connection to the client. Instead the client reports its results itself to the&nbsp;server.

By combining event handlers with passive checks and NRPE, nagios can apply automatic&nbsp;remediation when hosts get online.\
To configure and enable event handling on the nagios server follow these steps

# 1. Set path to script
Enable commands to be triggered when the event handler should be&nbsp;run on the server side
```bash
# /etc/nagios/private/resource.cfg
# uncomment $USER2$, as the path to the event handlers
$USER2$=/usr/lib64/nagios/plugins/eventhandlers
```

# 2. Place the server-side event handler in the $USER2$ path
```bash
/usr/lib64/nagios/plugins/eventhandlers/handle_windows
```

# 3. Add handle_windows as a new command in nagio(sql)
See also: <a href="https://assets.nagios.com/downloads/nagioscore/docs/nagioscore/3/en/macrolist.html#servicestate" target="_blank">https://assets.nagios.com/downloads/nagioscore/docs/nagioscore/3/en/macrolist.html#servicestate</a>

```bash
Command: handle_windows
Commandline: $USER2$/handle_windows $SERVICESTATE$ $SERVICESTATETYPE$ $SERVICEATTEMPT$
$HOSTADDRESS$ $SERVICEDISPLAYNAME$ $SERVICEDESC$
define command {
  command_name handle_windows
  command_line $USER2$/handle_windows $SERVICESTATE$
  $SERVICESTATETYPE$ $SERVICEATTEMPT$ $HOSTADDRESS$ &nbsp; &nbsp; $SERVICEDISPLAYNAME$ $SERVICEDESC$
  register 1
}
```

# 4. Create additional service in Nagiosql
Go to the services tab in nagiosql and
1. create a new service with a dummy check (will be reported by NSCA)
2. make sure the service check is configured and available on the client (next section)
3. enable the "Event handler" for this service (and select the right one (handle_windows)

# 5. Start services
Now make sure that both Nagios and the NSCA client are active and that Nagios is able to&nbsp;execute commands via NRPE and receive results from NSCA (check nagios.cfg for this).

# 6. Configuring the Nagios client
For Windows setup NSClient++
Make sure the following is configured:

```bash
#### nagios.cfg ####
[/modules]
CheckExternalScripts = 1
CheckSystem = 1
NRPEServer = 1
NSCAClient = 1
Scheduler= 1

[/settings/default]
 allowed hosts = #ipaddress of nagios server
 timeout = ##

# enable NRPE daemon
[/settings/NRPE/server]
 insecure = true
 allow arguments = true
 port = 5666</pre>

[/settings/NSCA/client]
 hostname = auto</pre>

[/settings/NSCA/client/targets/default]
 address = #ipadress of nagios server
 encryption = 0

# set targets of external scripts for service checks and remediation
[/settings/external scripts/scripts]
handle_domaintrust = cmd /c echo scripts\handle_my_issue.ps1 ; exit($lastexitcode) | powershell.exe -command -

check_my_issue = cmd /c echo scripts\check_my_issue.ps1 ; exit($lastexitcode) | powershell.exe -command -</pre>

# set the passive check run interval
[/settings/scheduler/schedules/default]
 interval = 30s</pre>
# schedule the check
[/settings/scheduler/schedules]
 check_my_issue = check_my_issue
 ```

# Debugging
To debug
1. tail -f nagios.log on the nagios server
2. net stop nscp on the client
3. nscp.exe test on the client
4. Now trigger the scripts / commands from either the server or the client (inside the nscp&nbsp;console)
(type queries to see if all scripts are listed)

