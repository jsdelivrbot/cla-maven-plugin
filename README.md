# Maven Plugin

<img src="https://cdn.jsdelivr.net/gh/clarive/cla-maven-plugin/public/icon/maven.svg?sanitize=true" alt="Maven Plugin" title="Maven Plugin" width="120" height="120">

Execute a maven script. Associate server agent will execute the script.

## What is Maven

Maven is a software project management and comprehension tool. Based on the concept of a project object model (POM), Maven can manage a project's build, reporting and documentation from a central piece of information.

## Requirements

This plugin requires Maven to be installed in the system where you wish to execute the command.

## Installing

To install the plugin place the cla-maven-plugin folder inside `$CLARIVE_BASE/plugins`
directory in Clarive's instance.

## Parameters

- **Server (variable name: server)** - Server that holds the remote file, server to connect to.
- **User (user)** - User allowed to connect to remote server.
- **Goals (goals)** - List of maven parameters that you can use.
- **Custom goals (custom)** - You can build a maven command with the parameters that you want or add parameters that are not in the list. Also you can use maven plugins or more complex commands. 
- **Home directory (path)** - Directory from which the local script is launched.

**Only Clarive EE**

- **Errors and output** - These two fields are related to manage control errors. Options are:
   - **Fail and output error** - Search for configurated error pattern in script output. If found, an error message is displayed in monitor showing the match.
   - **Warn and output warn** - Search for configurated warning pattern in script output. If found, an error message is displayed in monitor showing the match.,
   - **Custom** - In case combo box errors is set to custom a new form is showed to define the behavior with these fields:
   - **OK** - Range of return code values for the script to have succeeded. No message will be displayed in monitor.
   - **Warn** - Range of return code values to warn the user. A warn message will be displayed in monitor.
   - **Error** - Range of return code values for the script to have failed. An error message will be displayed in monitor.

## How to use

### In Clarive EE

Once the plugin is placed in its folder, you can find this service in the palette in the section of generic service and can be used like any other palette op.

Example:

```yaml
Server: Maven_server
User: Clarive_user
Goals: Compile
Path: /projects/maven_project/
Custom goals: archetype:generate -DgroupId=projectPackaging
            -DartifactId=ProjectName
            -DarchetypeArtifactId=maven-archetype-quickstart
            -DinteractiveMode=false
```

Executing this command we create a maven project with the package, the name and the type of project that we want

### In Clarive SE

### Rulebook

If you want to use the plugin through the Rulebook, in any `do` block, use this ops as examples to configure the different parameters:

```yaml
rule: Maven demo
do:
   - maven_task:
       server: maven_server   # use the mid set to the resource you created
       user: "clarive_user"
       path: "/projects/maven_project/"
       goals: ["compile"]           
       custom: ["archetype:generate -DgroupId=projectPackaging",
               "-DartifactId=ProjectName",
               "-DarchetypeArtifactId=maven-archetype-quickstart",
               "-DinteractiveMode=false"]
```

## Outputs

## Success

This service will return the console output generated by the Maven command executed.

```yaml
do:
   - maven_task:
       server: maven_server   # use the mid set to the resource you created
       user: "clarive_user"
       path: "/projects/maven_project/"
       goals: ["custom goals"]
       custom: ["--version"]
```

For this command the output will be similar to this one:

```yaml
Apache Maven 3.0.5 (Red Hat 3.0.5-17)
Maven home: /usr/share/maven
Java version: 1.8.0_144, vendor: Oracle Corporation
Java home: /usr/lib/jvm/java-1.8.0-openjdk-1.8.0.144-0.b01.el7_4.x86_64/jre
Default locale: en_US, platform encoding: UTF-8
OS name: "linux", version: "3.10.0-693.2.2.el7.x86_64", arch: "amd64", family: "unix"
 
```

## Possible configuration failures

### No project or goal

```yaml
[INFO] Scanning for projects...
[INFO] ------------------------------------------------------------------------
[INFO] BUILD FAILURE
[INFO] ------------------------------------------------------------------------
[INFO] Total time: 0.116s
[INFO] Finished at: Mon Oct 23 16:58:27 CEST 2017
[INFO] Final Memory: 6M/72M
[INFO] ------------------------------------------------------------------------
[ERROR] The goal you specified requires a project to execute but there is no POM in this directory (/opt/clarive/mvnproject). Please verify you invoked Maven from the correct directory. -> [Help 1]
[ERROR]
[ERROR] To see the full stack trace of the errors, re-run Maven with the -e switch.
[ERROR] Re-run Maven using the -X switch to enable full debug logging.
[ERROR]
[ERROR] For more information about the errors and possible solutions, please read the following articles:
[ERROR] [Help 1] http://cwiki.apache.org/confluence/display/MAVEN/MissingProjectException
```

Make sure you set the correct path and goal, and you have your pom file inside the project directory.

### Unrecognized option

```yaml
OUTPUT: Unable to parse command line options: Unrecognized option: -newoption
```

Make sure that the option is available in Maven.

### Variable required

```yaml
Error in rulebook (compile): Required argument(s) missing for op "maven_task": "task"
```

Make sure you have all required variables defined.

### Not allowed variable

```yaml
Error in rulebook (compile): Argument `Goals` not available for op "maven_task"
```

Make sure you are using the correct paramaters (make sure you are writing the variable names correctly).

## Tips

To get available commands in Maven, just run this command:

```yaml
do:
   - maven_task:
       server: maven_server   # use the mid set to the resource you created
       user: "clarive_user"
       path: "/projects/maven_project/"
       goals: ["custom goals"]
       custom: ["-h"]
```

## More questions?

Feel free to join **[Clarive Community](https://community.clarive.com/)** to resolve any of your doubts.