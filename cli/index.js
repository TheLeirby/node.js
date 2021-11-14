const {decodeCaesar, encodeCaesar,enAtbash} = require('./encryption');
const messageHelp =
`1. \x1b[7m-c\x1b[0m, \x1b[7m--config\x1b[0m:\t config for ciphers Config is a string with pattern {XY(-)}n, where:\n`+
`  * X is a cipher mark:\n`+
`    \x1b[7m- C\x1b[0m\t\tis for Caesar cipher (with shift 1)\n`+
`    \x1b[7m- A\x1b[0m\t\tis for Atbash cipher\n`+
`    \x1b[7m- R\x1b[0m\t\tis for ROT-8 cipher\n`+
`  * Y is flag of encoding or decoding (mandatory for Caesar cipher and ROT-8 cipher and should'nt be passed Atbash cipher)\n`+
`    \x1b[7m- 1\x1b[0m\t\tis for encoding\n`+
`    \x1b[7m- 0\x1b[0m\t\tis for decoding\n`+
`2. \x1b[7m-i\x1b[0m, \x1b[7m--input\x1b[0m: \ta path to input file\n`+
`3. \x1b[7m-o\x1b[0m, \x1b[7m--output\x1b[0m: \ta path to output file\n`+
`For example, config "C1-C1-R0-A" means "encode by Caesar cipher => encode by Caesar cipher => decode by ROT-8 => use Atbash"`;
const fs = require('fs');
function doParametr(code,inputParam){
    let i = 0;
    while (i < inputParam.length) {
        if (inputParam[i] == `-`) {i++} 
        if (inputParam[i] == `C`) {  
            i++                                       
            if (inputParam[i] == `1`) {
                code=encodeCaesar(`${code}`,1)                                          
            } else if(inputParam[i] == `0`) { 
                code=decodeCaesar(`${code}`,1);                                            
            } else {
                code=`error!`                
                i=inputParam.length+1;
                console.error(process.stderr.write(`Error: Attention! the request was not made correctly`))
                process.exit();
            }
        } else if (inputParam[i] == `A`) {
            code=enAtbash(`${code}`);                                                                                    
        } else if (inputParam[i] == `R`) {
            i++                                       
            if (inputParam[i] == `1`) {
                code=encodeCaesar(`${code}`,8)                                          
            } else if(inputParam[i] == `0`) { 
                code=decodeCaesar(`${code}`,8);                                            
            } else {
                code=`error!`
                
                i=inputParam.length+1;
                console.error(process.stderr.write(`Error: Attention! the request was not made correctly`))
                process.exit();
            }
        } else {
            
            code=`error! wrong query`
            
            i=inputParam.length+1;
            console.error(process.stderr.write(`Error: Attention! the request was not made correctly`))
            process.exit();
        }
        i++;

    }                 
   return code;

}

function whereIsParametr(shortString,longString,n){
    let isParametr = 0;
    let whereParametr = 0;
    let i=1;
   
    while (i<n+1){
        if (process.argv[2*i]==shortString || process.argv[2*i]==longString ) {
            isParametr++; 
            whereParametr=1+2*i;           
        }
        i++;
    }   
    if (isParametr==1){
        return whereParametr;
    } else if (isParametr>=2){
        console.error(process.stderr.write(`Error: Attention! Parametrs: `+longString+` is too much  `));
        process.exit();        
    } 
}

async function writeToFile(outputPath,input) {
    const writeStream = fs.createWriteStream(outputPath,{flags: 'a'});         
    writeStream.write(input);    
}

if (process.argv.length==4) {  
    let inputPath = process.argv[whereIsParametr("-i","--input",1)]; 
    let outputPath =  process.argv[whereIsParametr("-o","--output",1)];
    let inputParam = process.argv[whereIsParametr("-c","--config",1)]; 
    if  (inputParam==undefined) {
        process.stderr.write(`Error: Attention! Parametrs: `+process.argv[2]+` is not right\n`);
        process.exit(); 
   } 
    if  (outputPath==undefined) {
         process.stdout.write('The output file is not specified, we will output it to the console')
    } 
    if  (inputPath==undefined) {
        process.stdout.write('\nThe file for reading data is not specified, please enter the data into the console, in order to exit, enter "Crtl" + "C" ')
    }
    process.stdout.write('\nEnter the text: ');
    const readline = require('readline'),                
    {stdin: input, stdout: output} = require('process'),
    rl = readline.createInterface({ input, output });       
    rl.on('line', (input) => {                    
        process.stdout.write(`cipher result: `+doParametr(input,inputParam)+'\nEnter the text: ')
    });
     rl.on('SIGINT', () => {
        process.stdout.write(`Bay\n`)
        process.exit();  
    })
    rl.on('SIGTSTP', () => {
        process.stdout.write(`Bay\n`) 
        process.exit();  

    }) 
}

if (process.argv.length==6) {  
    if (whereIsParametr("-i","--input",2) <=8 || whereIsParametr("-o","--output",2) <=8 || whereIsParametr("-c","--config",2)<= 8 ){
        let inputPath = process.argv[whereIsParametr("-i","--input",2)]; 
        let outputPath =  process.argv[whereIsParametr("-o","--output",2)];
        let inputParam = process.argv[whereIsParametr("-c","--config",2)]; 


        if  (inputParam==undefined) {
            process.stderr.write(`Error: Attention! Parametrs: on config is not right\n`);
            process.exit(); 
        }        
        if  (inputPath==undefined) {
            process.stdout.write(`You have not entered the source text, please  do it from console. When need exit, press CTRL + C\n`);
            
        } 
                    
   
     
        if  (outputPath!==undefined) {
            writeToFile(outputPath,`\n=====\n`)          
        } else {
            process.stdout.write('The output file is not specified, we will output it to the console')
        }

        if (inputPath!==undefined){
            fs.stat(inputPath,  function(error, stats){    
                if (error ) {
                    process.stderr.write(`Error: Ssory, file not found or not correct write file name `)
                    process.exit();

                } else {    
                    const readStream = fs.createReadStream(inputPath) 
                    readStream.on('data', (chunk) =>{                                                      
                                           
                            if (error) {
                                process.stderr.write(`Error:ssory, error on chunk `+chunk)
                                process.exit();
                            } else {
                                if  (outputPath!==undefined) {
                                
                                    writeToFile(outputPath,doParametr(chunk,inputParam))
                                } else {                                    
                                    process.stdout.write(`\n here you Ciphering:\n================================\n`+doParametr(chunk,inputParam)+`\n`)
                                }
                            }
                    });
                }
            });
        } else {
           
                const readline = require('readline'),                
                {stdin: input, stdout: output} = require('process'),
                rl = readline.createInterface({ input, output }),
                process = require('process');      
                rl.on('line', (input) => {                    
                    writeToFile(outputPath,doParametr(input,inputParam)+'\n')
                   
                });
                rl.on('SIGINT', () => {
                    process.stdout.write(`Save... to file ${outputPath}\n`)
                    process.exit();  
                })
                rl.on('SIGTSTP', () => {
                    process.stdout.write(`Save... to file ${outputPath}\n`) 
                    process.exit();  
                })


    
        }
            
            

    } else {
        process.stderr.write(`Error: Error query `+messageHelp)
        process.exit();
    }
    
    
}

if (process.argv.length==8) {  
    if (whereIsParametr("-i","--input",3) <=8 || whereIsParametr("-o","--output",3) <=8 || whereIsParametr("-c","--config",3)<= 8 ){
        let inputPath = process.argv[whereIsParametr("-i","--input",3)]; 
        let outputPath =  process.argv[whereIsParametr("-o","--output",3)];
        let inputParam = process.argv[whereIsParametr("-c","--config",3)];       
        const writeStream = fs.createWriteStream(outputPath,{flags: 'a'});
        writeStream.write(`\n|||||| = new code = ||||||||\n`);
        fs.stat(inputPath,  function(error, stats){    
            if (error ) {
                process.stderr.write(`Error:ssory, file not found or not correct write file name `+messageHelp)
                process.exit();
            } else {    
                const readStream = fs.createReadStream(inputPath)                
                readStream.on('data', (chunk) =>{                                                      
                                       
                        if (error) {
                            process.stderr.write(`Error:ssory, error on chunk `+chunk)
                            process.exit();
                        } else {
                            writeStream.write(doParametr(chunk,inputParam));    
                        }
                });
            }
        });
            
            

    } else {
        process.stderr.write(`Error: Error query `+messageHelp);
        process.exit();
    }
    
    
}

if (process.argv.length==3 || process.argv.length==5 || process.argv.length==7 || process.argv.length>=9 ) {
     console.error(process.stderr.write(`Error: Error query `+messageHelp));
        process.exit();
}

