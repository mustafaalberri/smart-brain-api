const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

const imageDetect = (req, res) => {
    const PAT = '1e6976540a28462887b9c54c98b7dd3f';
    const USER_ID = 'clarifai';
    const APP_ID = 'main';
    const MODEL_ID = 'face-detection';
    // const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';
    const IMAGE_URL = req.body.imageURL;

    const stub = ClarifaiStub.grpc();

    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Key " + PAT);

    stub.PostModelOutputs(
        {
            user_app_id: {
                "user_id": USER_ID,
                "app_id": APP_ID
            },
            model_id: MODEL_ID,
            // version_id: MODEL_VERSION_ID, // This is optional. Defaults to the latest model version
            inputs: [
                { data: { image: { url: IMAGE_URL, allow_duplicate_url: true } } }
            ]
        },
        metadata,
        (err, response) => {
            try{
                if (err) throw new Error(err);

                if (response.status.code !== 10000) 
                    throw new Error("Post model outputs failed, status: " + response.status.description);
                
                res.json(response);
            }catch(err){
                res.status(400).json('Error detecting image.')
            }
        }
    );
};

const incrementEntries = (req, res, db) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
            .then(entries => res.json(entries[0].entries))
            .catch(() => res.status(400).json('Mmmm... something wrong has happened, please try again.'))
};

module.exports = {
    imageDetect,
    incrementEntries
};