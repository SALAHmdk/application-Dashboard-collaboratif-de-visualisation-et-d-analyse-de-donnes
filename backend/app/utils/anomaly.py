import pandas as pd

def detect_anomalies(df: pd.DataFrame, z_thresh: float = 3.0):
    numeric_df = df.select_dtypes(include=["float64", "int64"])
    if numeric_df.empty:
        return {}
    z_scores = (numeric_df - numeric_df.mean()) / numeric_df.std()
    anomalies = (z_scores.abs() > z_thresh).any(axis=1)
    return df[anomalies]
