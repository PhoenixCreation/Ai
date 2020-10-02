var rawData = []

const getData = async function () {

fetch('./data.json')
  .then(res => res.json())
  .then(data => {
    for (var i = 0; i < data['RELIANCE'].length; i++) {
      var temp ={
        "open": data['RELIANCE'][i]["Open Price"],
        "high": data['RELIANCE'][i]["High Price"],
        "low": data['RELIANCE'][i]["Low Price"],
        "close": data['RELIANCE'][i]["Close Price"],
        "Date": data['RELIANCE'][i]["Date"],
      }
      rawData.push(temp)
    }
    console.log("raw data :",rawData);
    function scaleDown(step) {
      return {
        open: step.open / 1500,
        high: step.high / 1500,
        low: step.low / 1500,
        close: step.close / 1500,

      }
    }

    function scaleUp(step) {
      return {
        open: step.open * 1500,
        high: step.high * 1500,
        low: step.low * 1500,
        close: step.close * 1500
      }
    }

    const scaledData = rawData.map(scaleDown);

    const trainingData = []

    for (var i = 0; i < 101; i=i+5) {
      trainingData.push(scaledData.slice(i,i+5))
    }
    trainingData.reverse()

    console.log("trainingData",trainingData);

    const net = new brain.recurrent.LSTMTimeStep({
      inputSize: 4,
      hiddenLayers: [8,8],
      outputSize: 4
    })

    net.train(trainingData, {
      errorThresh: 0.03
    })
    console.log("trained");

    // console.log(scaleUp(net.run(trainingData[0])));
    console.log(rawData[rawData.length - 3]["close"],rawData[rawData.length - 3]["Date"]);
    console.log(rawData[rawData.length - 2]["close"],rawData[rawData.length - 2]["Date"]);
    console.log(rawData[rawData.length - 1]["close"],rawData[rawData.length - 1]["Date"]);
    const result = net.forecast([
        trainingData
    ], 3).map(scaleUp)
    for (var i = 0; i < result.length; i++) {
      console.log(result[i].close, i);
    }

  })


}
getData()
