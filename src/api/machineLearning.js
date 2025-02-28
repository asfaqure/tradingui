import * as tf from '@tensorflow/tfjs';
import brain from 'brain.js';

export class PricePredictor {
  constructor() {
    this.model = new brain.recurrent.LSTMTimeStep({
      inputSize: 1,
      hiddenLayers: [10, 10],
      outputSize: 1
    });
  }

  async trainLSTM(data) {
    await this.model.train(data, {
      iterations: 200,
      log: (details) => console.log(details),
      logPeriod: 10
    });
  }

  predictNextPrice(data) {
    return this.model.run(data);
  }

  async trainTensorFlowModel(data) {
    const model = tf.sequential();
    model.add(tf.layers.lstm({
      units: 50,
      inputShape: [data.length, 1]
    }));
    model.add(tf.layers.dense({ units: 1 }));

    model.compile({
      optimizer: 'adam',
      loss: 'meanSquaredError'
    });

    const xs = tf.tensor3d(data.map((_, i) => data.slice(i, i + 10)));
    const ys = tf.tensor2d(data.slice(10).map(p => [p]));

    await model.fit(xs, ys, {
      epochs: 10,
      batchSize: 32
    });

    return model;
  }
}
