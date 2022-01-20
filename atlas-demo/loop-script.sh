#!/bin/bash
bash get_battery.sh
for i in {1..1000}
do
	ls -la > /dev/null
done
bash get_battery.sh
