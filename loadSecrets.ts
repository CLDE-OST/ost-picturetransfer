import { execSync } from 'child_process';

export function loadSecrets() {
  try {
    const secretName = 'SessionTokens';
    const region = 'us-east-1';

    // Abrufen der Secrets aus dem AWS Secrets Manager
    const secretString = execSync(
      `aws secretsmanager get-secret-value --secret-id ${secretName} --region ${region} --query SecretString --output text`
    ).toString();

    // Umwandeln von JSON in ein JS-Objekt
    return JSON.parse(secretString);
  } catch (error) {
    console.error('Fehler beim Laden der Secrets:', error);
    throw error;
  }
}
