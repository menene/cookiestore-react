import { Button } from "@/components/ui/button"

export default {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
    },
    disabled: {
      control: "boolean",
    },
  },
}

export const Default = {
  args: {
    children: "Agregar al carrito",
  },
}

export const Destructive = {
  args: {
    variant: "destructive",
    children: "Eliminar",
  },
}

export const Outline = {
  args: {
    variant: "outline",
    children: "Ver detalles",
  },
}

export const Secondary = {
  args: {
    variant: "secondary",
    children: "Secundario",
  },
}

export const Ghost = {
  args: {
    variant: "ghost",
    children: "Accion fantasma",
  },
}

export const Small = {
  args: {
    size: "sm",
    children: "Agregar",
  },
}

export const Large = {
  args: {
    size: "lg",
    children: "Confirmar pedido",
  },
}

export const Disabled = {
  args: {
    disabled: true,
    children: "No disponible",
  },
}
