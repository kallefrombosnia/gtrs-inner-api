const {GameTracker} = require('./functions/main');
const {main_page} = require('./functions/paths/paths');


// Data
const gtrs = new GameTracker(main_page, '', '');


gtrs.login()
.then(cookies => {   
    try {

        
        gtrs.getGtcCoinsStatus(cookies).then(status =>{
            console.log('Ur current gtc status', status)
        })  


        /*
        
        gtrs.boostServer(cookies, '', 'kalle').then(() =>{
            console.log('doneee')
        })
        
        /*
        gtrs.getJustAdded().then(res =>{
            console.log('new servers', res)
        })

        gtrs.getTopWorld().then(res =>{
            console.log('top world', res)
        })

        gtrs.getTopBalkan().then(res =>{
            console.log('top balkan', res)
        })

        gtrs.postStatus(cookies, 'Henlo from the other side').then((id) =>{
            console.log('got an id', id)
        })

        */

        
        
    } catch (error) {
        console.log(error)
    }
})
.catch(
    err => console.log(err)
);

gtrs.on('error', error =>{
    console.log('Error', error);
})
