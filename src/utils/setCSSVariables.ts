import { CSS_UNITS, CSS_VARIABLE_MAP } from 'const/constants';
import type { Settings } from 'const/types';

export function setCSSVariables(settings: Settings): void {
	const properties: Record<string, string> = {};

	for (const key in CSS_VARIABLE_MAP) {
		const cssVariable: string =
			CSS_VARIABLE_MAP[key as keyof Settings] ?? '';
		const value: string | number | boolean =
			settings[key as keyof Settings];
		const unit: string = CSS_UNITS[key as keyof Settings] ?? '';

		properties[cssVariable] = `${value.toString()}${unit}`;
	}

	activeDocument.body.setCssProps(properties);
}
