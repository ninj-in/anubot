const AWS = require('aws-sdk')
const codePipeline = new AWS.CodePipeline()
const Discord = require('discord.js')

if (!process.env.PRODUCTION)
  require('dotenv').config()

const PATCH_NOTES_CHANNELS = [
  576035940867244050
]

const putJobSuccess = (job_id, context) => {
  codePipeline.putJobSuccessResult({ jobId: job_id }, err => {
    if (err)
      context.fail(err)
    else
      context.succeed(message)
  })
}

const putJobFailure = (job_id, context, message) => {
  const params = {
    jobId: job_id,
    failureDetails: {
      message: JSON.stringify(message),
      type: 'JobFailed',
      externalExecutionId: context.invokeid
    }
  }
  codepipeline.putJobFailureResult(params, _ => context.fail(message))
}

const broadcastPatchNotes = input_artifact => {
  return new Promise((resolve, reject) => {
    try {
      console.log(input_artifact)
      console.log(input_artifact.location.s3Location)
      const client = new Discord.Client()
      client.on('ready', _ => {
        for (let id of PATCH_NOTES_CHANNELS)
          client.channels.get(id)
        resolve()
      })
    }
    catch(e) {
      reject(e)
    }
  })
}

exports.handler = async (event, context) => {
  const job_id = event['CodePipeline.job'].id
    
  broadcastPatchNotes(event['CodePipeline.job'].data.inputArtifacts[0])
  .then(_ => putJobSuccess(job_id, context))
  .catch(e => putJobFailure(job_id, context, e))
}