@echo off
rem
rem Copyright 2019, akashche at redhat.com
rem
rem Licensed under the Apache License, Version 2.0 (the "License");
rem you may not use this file except in compliance with the License.
rem You may obtain a copy of the License at
rem
rem http://www.apache.org/licenses/LICENSE-2.0
rem
rem Unless required by applicable law or agreed to in writing, software
rem distributed under the License is distributed on an "AS IS" BASIS,
rem WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
rem See the License for the specific language governing permissions and
rem limitations under the License.

set BAD_SLASH_APP_DIR=%~dp0..
set ST_APP_DIR=%BAD_SLASH_APP_DIR:\=/%

if "x" == "x%JAVA_HOME%" (
    echo "'JAVA_HOME' environment variable must be defined"
    exit /b 1
)

if "x" == "x%RHINO_HOME%" (
    echo "'RHINO_HOME' environment variable must be defined"
    exit /b 1
)

if "x" == "x%1" (
    echo "USAGE: bin\rhino <task> [args]"
    exit /b 1
)

"%JAVA_HOME%\bin\java" ^
        -XX:MaxRAM=256M ^
        -XX:+UseSerialGC ^
        -XX:+TieredCompilation ^
        -XX:TieredStopAtLevel=1 ^
        -cp "%RHINO_HOME%"/* ^
        --add-exports jdk.jlink/jdk.tools.jmod=ALL-UNNAMED ^
        org.mozilla.javascript.tools.shell.Main ^
        -O -1 ^
        "%ST_APP_DIR%"/init/runTask.js ^
        "%*"

