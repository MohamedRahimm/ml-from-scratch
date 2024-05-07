import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import pickle
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay, precision_score, recall_score, f1_score

seed = np.random.randint(0, 1e4)
np.random.seed(3433)
data = pd.read_csv("obesity_data.csv")
data = np.array(data)
m, n = data.shape

# convert weight descriptions to ints and gender to binary
data[data == "Male"] = 0
data[data == "Female"] = 1
data[data == "Underweight"] = 0
data[data == "Normal weight"] = 1
data[data == "Overweight"] = 2
data[data == "Obese"] = 3
# np.random.shuffle(data)
# design matrix (features,examples)
scaler = StandardScaler()
data = data
X_data = data[:, :-1]
X_data = X_data.astype(float)
X_data = scaler.fit_transform(X_data)
X_train = X_data[:800, :]
X_test = X_data[800:960, :]
X_validation = X_data[960:1000, :]

Y_data = data[:, -1]
Y_data = Y_data.astype(int)
Y_train = Y_data[:800]
Y_test = Y_data[800:960]
Y_validation = Y_data[960:1000]


def one_hot(Y):
    one_hot_Y = np.zeros((Y.size, Y.max()+1))
    one_hot_Y[np.arange(Y.size), Y] = 1
    return one_hot_Y


Y_train_one_hot = one_hot(Y_train)
Y_test_one_hot = one_hot(Y_test)
Y_validation_one_hot = one_hot(Y_validation)


class Model:
    def __init__(self, lr, dropout_keep_rate=1, l2_reg=0):
        self.layers = []
        self.dropout_k_rate = dropout_keep_rate
        self.l2_reg = l2_reg
        self.lr = lr

    def set_loss(self, loss_function):
        if (loss_function != "CELoss"):
            raise Exception("Unknown loss function")
        self.loss = loss_function
        return

    def train_loss_forward(self, Y_pred, Y_true):
        lamb = self.l2_reg
        eps = 1e-10
        cost = -(1/m) * np.sum(Y_true * np.log(Y_pred+eps))
        if (lamb != 0):
            weights = self.weights
            w_squared_sum = 0
            for W in weights:
                w_squared_sum += np.sum(np.square(W))
            l2_cost = (lamb/(2*m))*w_squared_sum
            cost += l2_cost
        return cost

    def valid_loss_forward(self, Y_pred, Y_true):
        eps = 1e-10
        cost = -(1/m) * np.sum(Y_true * np.log(Y_pred+eps))
        return cost

    def add_layer(self, layer):
        self.layers.append(layer)
        return

    def train_forward(self, X):
        layer_input = X
        self.weights = []
        self.bias = []
        self.A_vals = [layer_input,]
        self.Z_vals = []
        self.D_masks = []
        self.act_prime = []
        keep_prob = self.dropout_k_rate
        dropout = False
        if (keep_prob >= 1):
            dropout = True
        for layer in self.layers:
            layer_input = layer.forward(layer_input)
            if isinstance(layer, Dense_Layer):
                self.weights.append(layer.W)
                self.bias.append(layer.b)
                self.Z_vals.append(layer_input)
            else:
                if dropout == True and not isinstance(layer, Softmax):
                    D = np.random.rand(
                        layer_input.shape[0], layer_input.shape[1]) < keep_prob
                    A = layer_input * D
                    A = A / keep_prob
                    self.A_vals.append(A)
                    self.D_masks.append(D)
                else:
                    self.A_vals.append(layer_input)
                self.act_prime.append(layer.backward)

        return layer_input

    def valid_forward(self, X):
        layer_input = X
        self.weights = []
        for layer in self.layers:
            if isinstance(layer, Dense_Layer):
                self.weights.append(layer.W)
            layer_input = layer.forward(layer_input)
        return layer_input

    def backward(self, Y_true):
        if (self.loss == None):
            raise Exception("Loss function was not set")
        if (self.loss == "CELoss"):
            dropout = False
            l2 = False
            if (self.dropout_k_rate >= 1):
                dropout = True
            if (self.l2_reg != 0):
                l2 = True
            A_vals = self.A_vals
            W = self.weights
            Z_vals = self.Z_vals
            a_prime = self.act_prime
            lamb = self.l2_reg
            D_masks = self.D_masks
            self.weight_grads = []
            self.bias_grads = []
            dz = (1/m) * (A_vals[-1] - Y_true)
            dw = np.dot(A_vals[-2].T, dz)+(lamb*W[-1])/m
            db = np.sum(dz, axis=0, keepdims=True)
            self.weight_grads.append(dw)
            self.bias_grads.append(db)
            n_layers = len(A_vals) - 1
            for i in range(n_layers - 1, 0, -1):
                dz = np.dot(dz, W[i].T)
                if dropout:
                    dz = (dz * D_masks[i - 1]) / self.dropout_k_rate
                dz = dz * a_prime[i - 1](Z_vals[i - 1])
                dw = np.dot(A_vals[i - 1].T, dz)
                if l2:
                    dw += (lamb * W[i - 1]) / m
                db = np.sum(dz, axis=0, keepdims=True)
                self.weight_grads.append(dw)
                self.bias_grads.append(db)

            return

    def gradient_descent(self):
        lr = self.lr
        weights = self.weights
        weight_grads = self.weight_grads
        bias = self.bias
        bias_grads = self.bias_grads
        for w, w_grad, b, b_grad in zip(weights, reversed(weight_grads), bias, reversed(bias_grads)):
            w -= lr*w_grad
            b -= lr*b_grad
        idx = 0
        for i in range(len(self.layers)):
            if isinstance(self.layers[i], Dense_Layer):
                self.layers[i].W = weights[idx]
                self.layers[i].b = bias[idx]
                idx += 1

    def predict(self, X):
        layer_input = X
        for layer in self.layers:
            layer_input = layer.forward(layer_input)
        return np.argmax(layer_input, axis=1)

    def fit(self, epochs, patience=50):
        self.metrics = {
            "valid_costs": [],
            "train_costs": [],
            "valid_accuracies": [],
            "train_accuracies": [],
        }
        self.early_stop_epoch = epochs
        prev_mean_calc = None
        for i in range(epochs):
            A_valid = self.valid_forward(X_validation)
            self.metrics["valid_costs"].append(
                self.valid_loss_forward(A_valid, Y_validation_one_hot))

            A = self.train_forward(X_train)
            self.metrics["train_costs"].append(
                self.train_loss_forward(A, Y_train_one_hot))
            train_acc = np.sum(self.predict(X_train) == Y_train) / Y_train.size
            self.metrics["train_accuracies"].append(train_acc)
            valid_acc = np.sum(self.predict(X_validation) ==
                               Y_validation) / Y_validation.size
            self.metrics["valid_accuracies"].append(valid_acc)
            self.backward(Y_train_one_hot)
            self.gradient_descent()
            if (i > patience*2):
                if (prev_mean_calc == None):
                    prev_mean_calc = np.mean(
                        self.metrics["valid_costs"][i-patience:i])
                curr_mean_calc = np.mean(
                    self.metrics["valid_costs"][i-patience*2:i-patience])
                if (abs(prev_mean_calc-curr_mean_calc) < 1e-3):
                    self.early_stop_epoch = i+1
                    print(f"early stopped at epoch {i}")
                    return
                prev_mean_calc = curr_mean_calc
            if (i % 100 == 0):
                print(f"cost {self.metrics['train_costs'][-1]}")
        return

    def plot_metrics(self, Y_pred, Y_true):
        epochs = self.early_stop_epoch
        train_costs = self.metrics["train_costs"]
        val_costs = self.metrics["valid_costs"]
        val_accs = self.metrics["valid_accuracies"]
        train_accs = self.metrics["train_accuracies"]

        fig, axs = plt.subplots(2, 2, figsize=(12, 8))

        # Losses
        axs[0, 0].plot(range(epochs), train_costs,
                       label=f'Training Loss (best: {np.round(min(train_costs),4)}')
        axs[0, 0].plot(range(
            epochs), val_costs, label=f'Validation Loss (best: {np.round(min(val_costs),4)})')
        axs[0, 0].set_title('Losses')
        axs[0, 0].set_xlabel('Epochs')
        axs[0, 0].set_ylabel('Loss')
        axs[0, 0].legend()

        # Accuracies
        axs[0, 1].plot(range(epochs), train_accs,
                       label=f'Training Accuracy (best: {max(train_accs)})')
        axs[0, 1].plot(range(epochs), val_accs,
                       label=f'Validation Accuracy (best: {max(val_accs)})')
        axs[0, 1].set_title('Accuracies')
        axs[0, 1].set_xlabel('Epochs')
        axs[0, 1].set_ylabel('Accuracy')
        axs[0, 1].legend()

        # Confusion Matrix
        cm = confusion_matrix(Y_true, Y_pred)
        disp = ConfusionMatrixDisplay(confusion_matrix=cm)
        disp.plot(cmap="Blues", ax=axs[1, 0])
        axs[1, 0].set_title('Confusion Matrix')

        # Metrics
        axs[1, 1].axis('off')
        axs[1, 1].text(
            0.1, 0.8, f"Recall: {recall_score(Y_true, Y_pred, average='macro'):.4f}", transform=axs[1, 1].transAxes)
        axs[1, 1].text(
            0.1, 0.6, f"Precision: {precision_score(Y_true, Y_pred, average='macro'):.4f}", transform=axs[1, 1].transAxes)
        axs[1, 1].text(
            0.1, 0.4, f"F1 Score: {f1_score(Y_true, Y_pred, average='macro'):.4f}", transform=axs[1, 1].transAxes)
        axs[1, 1].text(
            0.1, 0.2, f"Test Accuracy: {(np.sum(self.predict(X_test) == Y_test) / Y_test.size):.4f}", transform=axs[1, 1].transAxes)
        axs[1, 1].text(
            0.1, 0, f"seed: {seed:.1f}", transform=axs[1, 1].transAxes)

        plt.tight_layout()
        plt.show()
        return


class relu:
    def forward(self, X):
        return np.maximum(0, X)

    def backward(self, Z):
        return np.where(Z <= 0, 0, 1)


class Softmax:
    def forward(self, X):
        X_max = np.max(X, axis=1, keepdims=True)
        X_shifted = X - X_max
        expX = np.exp(X_shifted)
        return expX / np.sum(expX, axis=1, keepdims=True)

    def backward(self, A):
        return A*(1-A)


class Dense_Layer:
    def __init__(self, n_x, n_y):
        self.W = np.random.rand(n_x, n_y) - 0.5
        self.b = np.zeros((1, n_y))

    def forward(self, X):
        Z = np.dot(X, self.W) + self.b
        return Z


# with open("pretrained_model.pkl", "rb") as dump_file:
#     mod = pickle.load(dump_file)
epochs = 1000
lr = 0.15
keep_prob = 0.4
l2_lambda = 0.1
mod = Model(lr=lr, dropout_keep_rate=keep_prob, l2_reg=l2_lambda)
mod.add_layer(Dense_Layer(X_train.shape[1], 500))
mod.add_layer(relu())
mod.add_layer(Dense_Layer(500, 500))
mod.add_layer(relu())
mod.add_layer(Dense_Layer(500, 500))
mod.add_layer(relu())
mod.add_layer(Dense_Layer(500, Y_train_one_hot.shape[1]))
mod.add_layer(Softmax())
mod.set_loss("CELoss")
mod.fit(epochs=epochs, patience=85)
mod.plot_metrics(Y_pred=mod.predict(X_test), Y_true=Y_test)


# with open("pretrained_model.pkl", "wb") as dump_file:
#     pickle.dump((mod), dump_file)
