import numpy as np
from scipy.stats import norm


def logistic_probability(theta: float, a: float, b: float) -> float:
    z = a * (theta - b)
    return 1.0 / (1.0 + np.exp(-z))


def fisher_information(theta: float, a: float, b: float) -> float:
    p = logistic_probability(theta, a, b)
    return a ** 2 * p * (1.0 - p)


def eap_update(prior_mean: float, prior_var: float, item_params: list[dict], scores: list[int]) -> tuple[float, float]:
    thetas = np.linspace(-4.0, 4.0, 161)
    prior = norm.pdf(thetas, loc=prior_mean, scale=np.sqrt(prior_var))
    likelihood = np.ones_like(thetas)
    for item, score in zip(item_params, scores):
        p = logistic_probability(thetas, item["a"], item["b"])
        likelihood *= p if score else (1 - p)
    posterior = prior * likelihood
    posterior /= np.trapz(posterior, thetas)
    mean = np.trapz(thetas * posterior, thetas)
    var = np.trapz((thetas - mean) ** 2 * posterior, thetas)
    return float(mean), float(var)
