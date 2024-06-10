# Design System Core

> A library of core UI components built with [Twind](https://twind.dev/), a tailwind-in-js solution.
 
The components implement the visual design language of AKASHA, and can be customised with tailwind style directives through the `customStyle` property.

For a showcase of the components you can visit our [storybook](https://storybook-awf.netlify.app/), and check out the DSCORE section.

## Usage

Visit the [Akasha Storybook](https://storybook-awf.netlify.app/) page for a visual demonstration of how the Design System Core components look. Code examples of how to start using these components in your app are also available. 

To use a component import it from the **design-system-core** package:

```tsx
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
```

### Stack

A container that lays out its content in one direction using flexbox.
Can be used to arrange other components:

```tsx
  <Stack direction="row" spacing="gap-4" padding="p-4" fullWidth>
    <ExampleComponent1>
    <ExampleComponent2>
  </Stack>
```

### Card

A container of information that has predefined styles following the AKASHA design language.
Has rounded borders and displays a box-shadow by default, making it useful for structuring
elements in apps.
Can be used as an entry point for other, more detailed elements:

```tsx
  <Card elevation={1} padding={'p-4'}>
    <ExampleComponent1>
    <ExampleComponent2>
  </Card>
```

### Button

A button component with rounded borders. Has 2 variants: `primary` for the call-to-action
use case and `secondary` for normal usage. It can also display an icon, or it can be text only.

```tsx
 <Button variant="secondary" label="Click me" onClick={handleClick}>
```

### Toggle

A toggle component with multiple sizes. Can be disabled.

```tsx
 <Toggle checked={isChecked} onChange={handleToggle} size="small">
```

### Checkbox

A checkbox component.

```tsx
<Checkbox label={'Checkbox'} name="check1" value="check1" handleChange={handleCheckbox} isSelected={isChecked} isDisabled={disableCheckbox} />
```

There are multiple other components in the package that can be customised to fit your needs.
