:: Starts Angular application at port 4200 (can be changed)
:: Opens browser at that port (Chrome by default)
:: Watches file, so when file is changes, Angular rebuilds application

cd C:\Users\Luka\Documents\workSheet\workSheet
set command = ng serve --watch --port 4200 --open
%command%